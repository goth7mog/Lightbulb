# Jenkins Credentials Setup

To run the CI/CD pipeline successfully, you need to configure the following credentials in Jenkins:

## 1. Harbor Registry Credentials

1. From the Jenkins dashboard, go to **Manage Jenkins** > **Manage Credentials**
2. Click on **Jenkins** under **Stores scoped to Jenkins**
3. Click on **Global credentials (unrestricted)**
4. Click **Add Credentials** on the left sidebar
5. Fill in the form:
   - **Kind**: Username with password
   - **Scope**: Global
   - **Username**: admin (or your Harbor username)
   - **Password**: habr111 (or your Harbor password)
   - **ID**: harbor-credentials
   - **Description**: Harbor Registry Credentials
6. Click **OK**

## 2. SonarQube Server Configuration

1. From the Jenkins dashboard, go to **Manage Jenkins** > **Configure System**
2. Find the **SonarQube servers** section
3. Click **Add SonarQube**
4. Fill in the details:
   - **Name**: SonarQube
   - **Server URL**: http://sonar:9000
   - **Server authentication token**: Generate a token in SonarQube (Administration > Security > Users > Tokens)
5. Save the configuration

## 3. SonarQube Scanner Installation

1. Go to **Manage Jenkins** > **Global Tool Configuration**
2. Find the **SonarQube Scanner** section
3. Click **Add SonarQube Scanner**
4. Fill in the details:
   - **Name**: SonarQube Scanner
   - **Install automatically**: Check this option
5. Save the configuration

## 4. Configure Pipeline Webhook for Automatic Triggering

1. In your GitHub/GitLab repository settings, add a webhook:
   - **Payload URL**: http://[your-jenkins-server]/github-webhook/ (for GitHub)
   - **Content type**: application/json
   - **Events**: Push events
2. In Jenkins, configure your pipeline job:
   - Go to the job configuration
   - Check **GitHub hook trigger for GITScm polling** under Build Triggers

## Next Steps After Configuration

Once you have completed all the credential and configuration steps above:

1. **Create a Jenkins Pipeline Job**:
   - From the Jenkins dashboard, click **New Item**
   - Enter a name for your pipeline (e.g., "banking-app-pipeline")
   - Select **Pipeline** as the job type and click **OK**
   - In the configuration page:
     - Under **Pipeline**, select **Pipeline script from SCM**
     - Set **SCM** to **Git**
     - Enter your repository URL
     - Specify the branch to build (e.g., */main or */master)
     - Set **Script Path** to **Jenkinsfile** (this is where your pipeline definition is stored)
     - Click **Save**

2. **Verify Plugin Installation**:
   - Go to **Manage Jenkins** > **Manage Plugins**
   - Under **Installed** tab, verify that these plugins are installed:
     - Docker Pipeline
     - SonarQube Scanner
     - Git Integration

3. **Test Your Pipeline**:
   - Go to your pipeline job
   - Click **Build Now** to manually trigger your first build
   - Monitor the build console output for any errors
   - Fix any issues that arise during the build

4. **Test Automatic Triggering**:
   - Make a small change to your repository
   - Push the change to trigger an automatic build
   - Verify that Jenkins automatically starts a new pipeline run

Your CI/CD pipeline should now be fully operational, automatically building, testing, scanning, and pushing your banking application to Harbor whenever code changes are pushed to your repository.
