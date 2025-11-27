# Deploying to Hugging Face Spaces

This guide explains how to deploy the Resume AI API to Hugging Face Spaces using Docker.

## Prerequisites

1. A Hugging Face account
2. The trained model file (`resume_strength_model.joblib`)
3. All application files in the `resume-ai-api` directory

## Step 1: Prepare Your Files

Make sure you have these files in your `resume-ai-api` directory:
- `Dockerfile`
- `app.py`
- `requirements.txt`
- `resume_strength_model.joblib` (trained model)

## Step 2: Create a Hugging Face Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Fill in the details:
   - **Space name**: `resume-bullet-analyzer` (or your preferred name)
   - **SDK**: Select **Docker**
   - **Visibility**: Public or Private
4. Click "Create Space"

## Step 3: Upload Files

You can upload files in two ways:

### Option A: Using Git (Recommended)

1. Clone your Hugging Face Space repository:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   cd YOUR_SPACE_NAME
   ```

2. Copy your files:
   ```bash
   cp resume-ai-api/Dockerfile .
   cp resume-ai-api/app.py .
   cp resume-ai-api/requirements.txt .
   cp resume-ai-api/resume_strength_model.joblib .
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Add Resume AI API"
   git push
   ```

### Option B: Using Web Interface

1. Go to your Space page
2. Click "Files and versions" tab
3. Click "Add file" → "Upload file"
4. Upload:
   - `Dockerfile`
   - `app.py`
   - `requirements.txt`
   - `resume_strength_model.joblib`

## Step 4: Configure Environment Variables (Optional)

If you need to customize CORS origins:

1. Go to your Space settings
2. Navigate to "Variables and secrets"
3. Add a variable:
   - **Name**: `ALLOWED_ORIGINS`
   - **Value**: `https://yourdomain.com,https://anotherdomain.com`

## Step 5: Wait for Build

Hugging Face will automatically:
1. Build your Docker image
2. Deploy your application
3. Make it available at: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`

The build process typically takes 5-10 minutes.

## Step 6: Test Your API

Once deployed, test the API:

```bash
curl -X POST "https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Implemented caching to reduce API latency by 40%"}'
```

Or visit the root URL to see the API documentation:
```
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/docs
```

## Step 7: Update Angular App

Update your Angular `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space'
};
```

## Troubleshooting

### Build Fails

- Check that all required files are present
- Verify `resume_strength_model.joblib` exists
- Check the build logs in Hugging Face Space

### Model Not Found Error

- Ensure `resume_strength_model.joblib` is in the same directory as `app.py`
- Verify the file was uploaded correctly

### CORS Errors

- Update `ALLOWED_ORIGINS` environment variable in Space settings
- Or modify the CORS configuration in `app.py`

### Port Issues

- Hugging Face Spaces automatically provides the `PORT` environment variable
- The Dockerfile uses `${PORT:-7860}` to handle this

## Updating the Model

To update the model with new training data:

1. Retrain locally: `python train_model.py`
2. Upload the new `resume_strength_model.joblib` to your Space
3. The Space will automatically rebuild

## Resources

- [Hugging Face Spaces Documentation](https://huggingface.co/docs/hub/spaces)
- [Docker on Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)

