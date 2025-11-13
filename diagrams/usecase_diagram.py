"""
Infrastructure Fix Citizen - Use Case Diagram (UML)
Proper UML Use Case Diagram with correct shapes and relationships
"""

from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.client import User, Users
from diagrams.onprem.compute import Server
from diagrams.generic.compute import Rack
from diagrams.custom import Custom

# For UML use case diagrams:
# - Actors are represented as stick figures (User/Users) ✓
# - Use cases are ovals - using Server/Rack shapes with custom styling
# - Associations are solid lines
# - <<include>> and <<extend>> are dashed lines with labels

with Diagram("Infrastructure Fix Citizen - Use Case Diagram", show=False, direction="LR"):
    
    # Actors (UML stick figures) - placed on left side
    with Cluster("Actors"):
        citizen = Users("Citizen")
        admin = User("Administrator")
        moderator = User("Moderator")
        guest = User("Guest")
    
    # System Boundary
    with Cluster("Citizn System"):
        
        # Authentication & Account Management Use Cases
        with Cluster("Authentication"):
            register = Server("Register Account")
            login = Server("Login")
            logout = Server("Logout")
            view_profile = Server("View Profile")
            update_profile = Server("Update Profile")
        
        # Citizen Use Cases
        with Cluster("Citizen Features"):
            report_issue = Server("Report Issue")
            report_offline = Server("Report Issue\n(Offline)")
            instant_report = Server("Instant Report")
            view_my_reports = Server("View My Reports")
            view_all_issues = Server("View All Issues")
            view_issue_details = Server("View Issue Details")
            upvote_issue = Server("Upvote Issue")
            add_comment = Server("Add Comment")
            view_map = Server("View Map")
            track_status = Server("Track Status")
            view_analytics = Server("View Analytics")
            edit_own_issue = Server("Edit Own Issue")
            delete_own_issue = Server("Delete Own Issue")
        
        # Admin Use Cases
        with Cluster("Admin Features"):
            admin_dashboard = Server("Admin Dashboard")
            manage_all_issues = Server("Manage All Issues")
            update_issue_status = Server("Update Status")
            assign_issue = Server("Assign Issue")
            categorize_issue = Server("Categorize Issue")
            delete_any_issue = Server("Delete Any Issue")
            admin_analytics = Server("Analytics & Reports")
            generate_report = Server("Generate Report")
            export_data = Server("Export Data")
            manage_users = Server("Manage Users")
            view_statistics = Server("System Statistics")
        
        # Moderator Use Cases
        with Cluster("Moderator Features"):
            moderate_content = Server("Moderate Content")
            moderate_issues = Server("Moderate Issues")
            moderate_comments = Server("Moderate Comments")
            update_status_mod = Server("Update Status")
        
        # Public/Guest Use Cases
        with Cluster("Public Features"):
            view_landing = Server("View Landing Page")
            view_public_issues = Server("View Public Issues")
            browse_issues = Server("Browse Issues")
    
    # Associations - Citizen (solid lines)
    citizen >> Edge(color="black") >> register
    citizen >> Edge(color="black") >> login
    citizen >> Edge(color="black") >> logout
    citizen >> Edge(color="black") >> view_profile
    citizen >> Edge(color="black") >> update_profile
    citizen >> Edge(color="black") >> report_issue
    citizen >> Edge(color="black") >> report_offline
    citizen >> Edge(color="black") >> instant_report
    citizen >> Edge(color="black") >> view_my_reports
    citizen >> Edge(color="black") >> view_all_issues
    citizen >> Edge(color="black") >> view_issue_details
    citizen >> Edge(color="black") >> upvote_issue
    citizen >> Edge(color="black") >> add_comment
    citizen >> Edge(color="black") >> view_map
    citizen >> Edge(color="black") >> track_status
    citizen >> Edge(color="black") >> view_analytics
    citizen >> Edge(color="black") >> edit_own_issue
    citizen >> Edge(color="black") >> delete_own_issue
    
    # Associations - Admin (solid lines)
    admin >> Edge(color="black") >> login
    admin >> Edge(color="black") >> logout
    admin >> Edge(color="black") >> view_profile
    admin >> Edge(color="black") >> admin_dashboard
    admin >> Edge(color="black") >> manage_all_issues
    admin >> Edge(color="black") >> update_issue_status
    admin >> Edge(color="black") >> assign_issue
    admin >> Edge(color="black") >> categorize_issue
    admin >> Edge(color="black") >> delete_any_issue
    admin >> Edge(color="black") >> admin_analytics
    admin >> Edge(color="black") >> generate_report
    admin >> Edge(color="black") >> export_data
    admin >> Edge(color="black") >> manage_users
    admin >> Edge(color="black") >> view_statistics
    admin >> Edge(color="black") >> view_all_issues
    admin >> Edge(color="black") >> view_map
    
    # Associations - Moderator (solid lines)
    moderator >> Edge(color="black") >> login
    moderator >> Edge(color="black") >> logout
    moderator >> Edge(color="black") >> view_profile
    moderator >> Edge(color="black") >> moderate_content
    moderator >> Edge(color="black") >> moderate_issues
    moderator >> Edge(color="black") >> moderate_comments
    moderator >> Edge(color="black") >> update_status_mod
    moderator >> Edge(color="black") >> view_all_issues
    moderator >> Edge(color="black") >> add_comment
    
    # Associations - Guest (solid lines)
    guest >> Edge(color="black") >> view_landing
    guest >> Edge(color="black") >> view_public_issues
    guest >> Edge(color="black") >> browse_issues
    guest >> Edge(color="black") >> register
    
    # Include relationships (dashed lines pointing to included use case)
    # Login is included by authenticated use cases
    report_issue >> Edge(label="include", style="dashed", color="blue") >> login
    view_my_reports >> Edge(label="include", style="dashed", color="blue") >> login
    admin_dashboard >> Edge(label="include", style="dashed", color="blue") >> login
    moderate_content >> Edge(label="include", style="dashed", color="blue") >> login
    
    # Extend relationships (dashed lines pointing from extending use case)
    # View Issue Details extends View All Issues
    view_all_issues << Edge(label="extend", style="dashed", color="green") << view_issue_details
    # View Map extends View All Issues
    view_all_issues << Edge(label="extend", style="dashed", color="green") << view_map
    # Add Comment extends View Issue Details
    view_issue_details << Edge(label="extend", style="dashed", color="green") << add_comment
    # Upvote Issue extends View Issue Details
    view_issue_details << Edge(label="extend", style="dashed", color="green") << upvote_issue

