import pytest
from django.db import connection


@pytest.mark.django_db
def test_db_can_connect_and_run_simple_query():
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1;")
        row = cursor.fetchone()
    assert row[0] == 1


