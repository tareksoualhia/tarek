from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterClientView, LoginClientView, LogoutView, 
    ResetPasswordView, ForgotPasswordView, ClientProfileView,
    ContratListCreateView, ContratDetailView,
    FactureListCreateView, FactureDetailView,
    AdminLoginView, LogoutAdminView,
    ProductViewSet ,ContratsViewSet,FacturesViewSet,ContratsClientViewSet,subscribe_contrat ,FacturesByClientView,LatestFactureByClientView,   
                list_reclamations,create_reclamation,UpdateClientProfileView,create_payment_intent,RespondReclamationView,AdminReclamationListView,total_users,total_reclamations,total_contrats,ProductsClientViewSet,initiate_payment,CreateOrderView,PurchaseHistoryView
)

from django.conf.urls.static import static
from django.conf import settings

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')  # ✅ ajout route CRUD
router.register(r'client/products', ProductsClientViewSet, basename='client-products')
router.register(r'contrats', ContratsViewSet, basename='contrats')
router.register(r'client/contrats', ContratsClientViewSet, basename='client-contrats')
router.register(r'factures', FacturesViewSet, basename='factures')

urlpatterns = [
    path("register/", RegisterClientView.as_view(), name="register"),
    path("login/", LoginClientView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    
    
    path("profile/", ClientProfileView.as_view(), name="client-profile"),
    path("profile/update/", UpdateClientProfileView.as_view(), name="update-profile"),
    path("forgotpassword/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("resetpassword/<int:client_id>/<str:token>/", ResetPasswordView.as_view(), name="reset-password"),

    path("contrat/", ContratListCreateView.as_view(), name="contrat-list-create"),
    path("contrat/<int:pk>/", ContratDetailView.as_view(), name="contrat-detail"),
    path("facture/", FactureListCreateView.as_view(), name="facture-list-create"),
    path("facture/<int:pk>/", FactureDetailView.as_view(), name="facture-detail"),
    path('adminlogin/', AdminLoginView.as_view(), name='admin-login'),
    path("adminlogout/", LogoutAdminView.as_view(), name="admin_logout"),
    path('contrats/<int:contrat_id>/subscribe/', subscribe_contrat, name='subscribe-contrat'),
    
    path('clients/<int:client_id>/factures/', FacturesByClientView.as_view(), name='client-factures'),
    path('clients/<int:client_id>/factures/latest/', LatestFactureByClientView.as_view(), name='client-latest-facture'),
    path('', include(router.urls)),  # ✅ inclure le router
    path("factures/<int:facture_id>/create-payment-intent/", create_payment_intent, name="create_payment_intent"),
    path('initiate-payment/', initiate_payment, name='initiate-payment'),
   
 
    path("reclamations/<int:reclamation_id>/respond/",RespondReclamationView.as_view(), name="respond-reclamation"),
    path("admin/reclamations/", AdminReclamationListView.as_view(), name="admin-reclamations"),

     path("reclamations/", list_reclamations, name="list-reclamations"),
    path("reclamations/add/", create_reclamation, name="add-reclamation"),


     path('total-clients/', total_users,name="total users"),
     path('total-reclamations/', total_reclamations,name="total reclamations"),
     path('total-contrats/', total_contrats,name="total_contrats"),



      path('create-order/', CreateOrderView.as_view(), name='create-order'),
      path('purchase-history/', PurchaseHistoryView.as_view(), name='purchase-history'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
