# Setting Up GitHub Webhook for Automatic Jenkins Triggers

This guide explains how to configure a GitHub webhook to automatically trigger the Jenkins pipeline whenever code is pushed to your repository.

## Prerequisites

1. Administrator access to your GitHub repository
2. A publicly accessible Jenkins server (or one accessible to GitHub)

## Steps to Configure the Webhook

### 1. Get Jenkins Webhook URL

The standard Jenkins webhook URL format is:
```
http://<jenkins-server>/github-webhook/
```

### 2. Add Webhook in GitHub

1. Go to your GitHub repository
2. Click on **Settings** → **Webhooks**
3. Click on **Add webhook**
4. Configure the webhook:
   - **Payload URL**: Enter your Jenkins webhook URL
   - **Content type**: Select `application/json`
   - **Secret**: (Optional) Set a secret token for increased security
   - **Which events would you like to trigger this webhook?**: Select "Just the push event"
   - Ensure **Active** is checked
5. Click **Add webhook**

### 3. Configure Jenkins Job

1. Go to your Jenkins pipeline job
2. Click **Configure**
3. Under **Build Triggers**, check **GitHub hook trigger for GITScm polling**
4. Save the configuration

### 4. Test the Webhook

1. Make a small change to your repository
2. Commit and push the change
3. Go to your GitHub repository → Settings → Webhooks
4. Check the latest delivery to see if it was successful
5. Verify in Jenkins that a new build was triggered automatically

## Troubleshooting

If the webhook is not triggering builds:

1. Check if the payload URL is correct and accessible from GitHub
2. Review the webhook's recent deliveries in GitHub to see any error messages
3. Ensure your Jenkins has the GitHub plugin installed
4. Check Jenkins logs for any issues related to webhook reception
