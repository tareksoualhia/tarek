pipeline {
  agent any

  environment {
    VENV_DIR = 'venv'
    REPO_URL = 'https://github.com/tareksoualhia/tarek.git'
  }

  stages {
    stage('Clone Backend Repo') {
      steps {
        echo 'Cloning backend repo...'
        git url: "${REPO_URL}"
      }
    }

    stage('Set Up Python Environment') {
      steps {
        echo 'Setting up Python virtual environment...'
        sh '''
          python -m venv $VENV_DIR
          source $VENV_DIR/bin/activate
          pip install --upgrade pip
          pip install -r requirements.txt
        '''
      }
    }

    stage('Run Django Tests') {
      steps {
        echo 'Running Django tests...'
        sh '''
          source $VENV_DIR/bin/activate
          python manage.py test
        '''
      }
    }
  }

  post {
    success {
      echo '✅ All tests passed!'
    }
    failure {
      echo '❌ Tests failed. Check the logs.'
    }
    always {
      echo '📦 Pipeline finished.'
    }
  }

  
}
