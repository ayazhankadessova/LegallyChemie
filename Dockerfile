FROM python:3.10-slim as backend

WORKDIR /app/backend

COPY backend/ .

RUN pip install -r requirements.txt

FROM node:16 as frontend

WORKDIR /app/frontend

COPY frontend/ .

RUN npm install && npm run build

FROM python:3.10-slim as final

WORKDIR /app

COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/build /app/frontend/build

RUN pip install -r backend/requirements.txt

EXPOSE 8000

CMD ["uvicorn", "backend.app.server:app", "--host", "0.0.0.0", "--port", "8000"]