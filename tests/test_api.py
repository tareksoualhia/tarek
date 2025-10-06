import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.mark.django_db
def test_login_requires_credentials(api_client: APIClient):
    response = api_client.post("/login/", data={}, format="json")
    assert response.status_code in {400, 401}


@pytest.mark.django_db
def test_products_requires_auth(api_client: APIClient):
    response = api_client.get("/products/")
    assert response.status_code in {401, 403}


def test_metrics_endpoint_accessible(api_client: APIClient):
    # Prometheus metrics exposed at /metrics/
    resp = api_client.get("/metrics")
    assert resp.status_code == 200

