"""
Infrastructure Fix Citizen - System Architecture Diagram
Generates a visual representation of the system architecture
"""

from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.client import User, Users
from diagrams.onprem.compute import Server
from diagrams.onprem.database import PostgreSQL
from diagrams.generic.storage import Storage
from diagrams.onprem.network import Internet
from diagrams.generic.place import Datacenter
from diagrams.custom import Custom

# Download custom icons for services not in the standard library
from urllib.request import urlretrieve
import os

# Custom icons URLs
supabase_icon = "https://supabase.com/favicon.ico"
geoapify_icon = "https://www.geoapify.com/favicon.ico"
leaflet_icon = "https://leafletjs.com/docs/images/logo.png"

# Download icons if they don't exist
def download_icon(url, filename):
    if not os.path.exists(filename):
        try:
            urlretrieve(url, filename)
        except:
            pass  # If download fails, will use default icon

download_icon(supabase_icon, "supabase.png")
download_icon(geoapify_icon, "geoapify.png")
download_icon(leaflet_icon, "leaflet.png")

with Diagram("Infrastructure Fix Citizen - System Architecture", show=False, direction="TB"):
    
    # User Layer
    with Cluster("Users"):
        citizens = Users("Citizens")
        admins = User("Admins")
        moderators = User("Moderators")
    
    # Frontend Layer
    with Cluster("Frontend Application"):
        frontend = Server("React + Vite PWA")
        offline_storage = Storage("IndexedDB\n(Dexie)")
        maps_client = Custom("Leaflet Maps", "leaflet.png" if os.path.exists("leaflet.png") else None)
    
    # External Services
    with Cluster("External Services"):
        geoapify = Custom("Geoapify API\n(Geocoding)", "geoapify.png" if os.path.exists("geoapify.png") else None)
    
    # Backend Layer
    with Cluster("Supabase Backend"):
        with Cluster("Authentication"):
            auth = Server("Supabase Auth\n(JWT)")
        
        with Cluster("Database"):
            database = PostgreSQL("PostgreSQL\n(RLS Enabled)")
        
        with Cluster("Storage"):
            storage = Storage("Supabase Storage\n(Images)")
        
        with Cluster("Functions"):
            functions = Server("Edge Functions\n(Triggers)")
    
    # Connections
    # Users to Frontend
    citizens >> Edge(label="Access") >> frontend
    admins >> Edge(label="Access") >> frontend
    moderators >> Edge(label="Access") >> frontend
    
    # Frontend to Offline Storage
    frontend >> Edge(label="Offline Reports", color="orange", style="dashed") >> offline_storage
    
    # Frontend to External Services
    frontend >> Edge(label="Geocoding", color="green") >> geoapify
    frontend >> Edge(label="Map Rendering", color="blue") >> maps_client
    
    # Frontend to Backend
    frontend >> Edge(label="Authentication", color="purple") >> auth
    frontend >> Edge(label="API Calls", color="darkblue") >> database
    frontend >> Edge(label="Image Upload", color="darkgreen") >> storage
    
    # Backend internal connections
    auth >> Edge(label="Verify JWT", color="purple", style="dashed") >> database
    database >> Edge(label="Triggers", color="gray", style="dotted") >> functions
    functions >> Edge(label="Process", color="gray", style="dotted") >> database
    
    # Sync connection
    offline_storage >> Edge(label="Sync When Online", color="orange", style="bold") >> frontend

