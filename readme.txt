do this in your prject-root:
pip install -r requirements.txt
create .env file and add this:
EMAIL_USER=mail
EMAIL_PASS=apppassword


SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=admin@example.com


DATABASE_URL=postgresql://neondb_owner:npg_z4Ff9PRLWqGs@ep-rapid-field-ae2h6p2h-pooler.c-2.us-east-2.aws.neon.tech/ingestor_db?sslmode=require&channel_binding=require
