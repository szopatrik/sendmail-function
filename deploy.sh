gcloud auth login *USER_EMAIL*
gcloud config set project *PROJECT_NAME*

gcloud functions deploy *FUNCTION_NAME* \
  --entry-point main \
  --runtime nodejs16 \
  --region europe-west3 \
  --memory 256Mi \
  --max-instances 1 \
  --trigger-topic *TOPIC_NAME* \
  --env-vars-file .env.yaml \
  --timeout=540

#gcloud functions call *YOUR_FUNCTION_NAME* --data '{}'
#gcloud functions logs read --region europe-west3 *FUNCTION_NAME*
