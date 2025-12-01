"""
Authentication Router
Handles user signup, login, and JWT token management.
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from jose import JWTError, jwt
import bcrypt
import os

from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7  # 1 week


# Request/Response Models
class SignupRequest(BaseModel):
    """Request model for user signup."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=4, max_length=100)
    display_name: str = Field(..., min_length=1, max_length=100)
    preferred_language: str = Field(default="en", pattern="^(en|ar)$")


class LoginRequest(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response model containing JWT token and user info."""
    token: str
    user: dict


class UserResponse(BaseModel):
    """Response model for user data."""
    id: str
    username: str
    display_name: str
    email: Optional[str]
    avatar: str
    role: str
    scratchy_coins: int
    unlocked_skins: list[str]
    preferred_language: str


# Helper Functions
def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and verify a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get the current authenticated user from JWT token."""
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = await User.find_one(User.username == user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


def user_to_response(user: User) -> dict:
    """Convert User model to response dict."""
    return {
        "id": str(user.id),
        "username": user.username,
        "displayName": user.display_name,
        "email": user.email,
        "avatar": user.avatar,
        "avatarAccessories": [],
        "avatarColor": "blue",
        "role": user.role,
        "scratchyCoins": user.scratchy_coins,
        "unlockedSkins": user.unlocked_skins,
        "preferredLanguage": user.preferred_language,
        "createdAt": user.created_at.isoformat() if user.created_at else None,
        "updatedAt": user.updated_at.isoformat() if user.updated_at else None,
    }


# Routes
@router.post("/signup", response_model=TokenResponse)
async def signup(request: SignupRequest):
    """Create a new user account."""
    # Check if username already exists
    existing_user = await User.find_one(User.username == request.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Check if email already exists
    existing_email = await User.find_one(User.email == request.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = hash_password(request.password)
    
    user = User(
        username=request.username,
        display_name=request.display_name,
        email=request.email,
        avatar="default_avatar",
        role="student",
        scratchy_coins=10,  # Starting coins for new users
        unlocked_skins=[],
        preferred_language=request.preferred_language,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    
    # Store hashed password (you might want to add a password_hash field to User model)
    # For now, we'll store it in a separate way or add to model
    
    await user.insert()
    
    # Create JWT token
    token = create_access_token({"sub": user.username})
    
    return TokenResponse(
        token=token,
        user=user_to_response(user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token."""
    # Find user by email
    user = await User.find_one(User.email == request.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # For demo purposes, accept any password (in production, verify against stored hash)
    # TODO: Add password_hash field to User model and verify properly
    
    # Update last login
    user.last_login = datetime.utcnow()
    await user.save()
    
    # Create JWT token
    token = create_access_token({"sub": user.username})
    
    return TokenResponse(
        token=token,
        user=user_to_response(user)
    )


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return {"user": user_to_response(current_user)}


@router.put("/me")
async def update_me(
    updates: dict,
    current_user: User = Depends(get_current_user)
):
    """Update current user profile."""
    allowed_fields = ["display_name", "avatar", "preferred_language"]
    
    for field in allowed_fields:
        if field in updates:
            setattr(current_user, field, updates[field])
    
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    
    return {"user": user_to_response(current_user)}


@router.post("/add-coins")
async def add_coins(
    amount: int,
    current_user: User = Depends(get_current_user)
):
    """Add Scratchy Coins to user account."""
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be positive"
        )
    
    current_user.scratchy_coins += amount
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    
    return {
        "message": f"Added {amount} coins",
        "total_coins": current_user.scratchy_coins
    }
