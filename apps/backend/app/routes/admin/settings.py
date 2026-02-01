from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from app.models.settings import GlobalSettings
from app.models.user import User
from app.utils.dependencies import get_admin_user
from app.utils.gridfs import upload_contest_logo_to_gridfs, delete_contest_logo_from_gridfs, open_contest_logo_stream
from app.utils.timezone import now_ist
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin/settings", tags=["Admin - Settings"])

class UploadResponse(BaseModel):
    url: str
    message: str

@router.post("/logo", response_model=UploadResponse)
async def upload_default_logo(
    file: UploadFile = File(..., description="Default contest logo image"),
    current_user: User = Depends(get_admin_user),
):
    settings = await GlobalSettings.get_instance()

    # Delete old logo if it exists
    if settings.default_contest_logo_file_id:
        await delete_contest_logo_from_gridfs(settings.default_contest_logo_file_id)

    # Save new logo
    try:
        file_id = await upload_contest_logo_to_gridfs(file, filename_prefix="default_contest_logo")
        settings.default_contest_logo_file_id = file_id
        settings.updated_at = now_ist()
        await settings.save()
        
        return UploadResponse(
            url="/api/admin/settings/logo",
            message="Default logo uploaded successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload logo: {str(e)}")

@router.get("/logo")
async def get_default_logo():
    """Serve the default contest logo"""
    settings = await GlobalSettings.get_instance()
    
    if not settings.default_contest_logo_file_id:
        # Fallback or 404? 
        raise HTTPException(status_code=404, detail="Default logo not found")

    stream, content_type = await open_contest_logo_stream(settings.default_contest_logo_file_id)
    data = await stream.read()
    return Response(content=data, media_type=content_type)
