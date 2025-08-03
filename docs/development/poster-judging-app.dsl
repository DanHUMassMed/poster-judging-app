workspace "Poster Judging Application" "Context + Containers view for the academic Poster Judging app with billing and customer accounts" {

  model {
    // ----- Actors -----
    organizer = person "Organizer" "Conference chair or committee member who manages judging workflows"
    judge = person "Judge" "Certified judge who scores posters"
    presenter = person "Presenter" "Poster author; can upload/update posters and respond to Q&A"
    customer = person "Customer Account Admin" "Responsible for payment, usage, and billing plan selection"

    // ----- External Systems -----
    group "External Services" {
      emailSystem = softwareSystem "Email Service" "SendGrid/Mailgun-like SMTP/email provider"
      authService = softwareSystem "Authentication Provider" "OAuth or SSO identity provider for login"
      billingSystem = softwareSystem "Square Billing System" "External service for processing credit card payments and billing plans"
    }

    // ----- The main software system -----
    posterSys = softwareSystem "Poster Judging System" "Zero-login, mobile-friendly platform for managing poster sessions" {

      webApp = container "Organizer Admin UI" "Browser-based application used by organizers and customer admins" "React"
      scoringForm = container "Scoring Frontend" "Mobile-responsive PWA that judges access via QR codes" "React / PWA (Progressive Web App)"
      importer = container "CSV Importer" "Bulk imports judges & posters metadata into system" "Node.js CLI/microservice"
      assignment = container "Assignment Engine" "Stateless microservice to auto-assign judges to posters" "Python microservice"
      storage = container "Poster File Storage" "Object storage for poster PDFs, PPTs, videos, etc." "S3-style blob store"
      database = container "Application Database" "Stores judges, posters, scores, usage, assignments, and billing" "PostgreSQL or MySQL"
      reporting = container "Reporting / Export Service" "Exports session data, scores, metadata and reports" "Python microservice"

      apiApp = container "API Backend" "REST API powering both organizer UI and scoring interface" "Python / FastAPI" {
        // --- Component-level breakdown ---
        assignmentController = component "AssignmentController" "Handles assignment-trigger requests" "FastAPI endpoint"
        scoringController = component "ScoringController" "Handles score submissions" "FastAPI endpoint"
        posterController = component "PosterController" "Manages poster metadata and file references" "FastAPI endpoint"
        authController = component "AuthController" "Handles authentication and authorization" "FastAPI endpoint"
        emailClient = component "EmailClient" "Sends emails via Email Service API" "Python requests/SMTP client"
        securityService = component "SecurityService" "Validates tokens and manages user sessions" "JWT / OAuth2 handler"
        assignmentService = component "AssignmentService" "Business logic for judge-poster assignments" "Python service logic"

        billingController = component "BillingController" "Manages plan selection, usage tracking, and payment events" "FastAPI endpoint"
        billingService = component "BillingService" "Tracks usage, enforces plan limits, integrates with Square" "Python service logic"
      }
    }

    // ----- Relationships: Actors → System -----
    organizer -> webApp "Configures events, uploads judges/posters, defines rubrics"
    judge -> scoringForm "Scans poster QR / deep-links to scoring form"
    presenter -> webApp "Uploads poster content and responds to Q&A"
    presenter -> scoringForm "Views Q&A/comments after judging ends"
    customer -> webApp "Manages billing settings, usage plan, and payments"

    // ----- Relationships: UI → Backend -----
    webApp -> apiApp "Uses JSON/HTTPS API for admin and billing features"
    scoringForm -> apiApp "Loads scoring forms; submits judge scores"
    importer -> apiApp "Bulk uploads judge and poster data"
    webApp -> authService "SSO login (organizer/presenter)"
    apiApp -> authService "Validates tokens and roles"

    // ----- Relationships: API → Internals -----
    apiApp -> database "Reads/writes posters, scores, assignments, customer plans"
    apiApp -> assignment "Delegates judge-poster assignment logic"
    apiApp -> storage "Generates signed URLs for uploads/downloads"
    scoringForm -> storage "Loads poster content and thumbnails"
    reporting -> database "Reads session history and judging data"
    reporting -> storage "Bundles poster files for export"

    apiApp -> emailSystem "Sends judge invites, reminders, award announcements"
    emailClient -> emailSystem "Sends notifications via SMTP or email API"
    assignmentService -> emailClient "Notifies judges of assignments"
    scoringController -> emailClient "Confirms scoring to judges"

    // Billing-specific relationships
    customer -> billingSystem "Enters payment info, receives invoices"
    apiApp -> billingSystem "Sends plan metadata and listens for webhook events"
    billingController -> billingService "Triggers billing logic"
    billingService -> billingSystem "Processes payments, subscriptions via Square API"
    billingService -> database "Reads/writes plan tier, usage counts, customer metadata"

    // ----- Component Interactions -----
    webApp -> assignmentController "Triggers judge auto-assignment"
    webApp -> billingController "Updates plan or retrieves usage info"
    webApp -> authController "Authenticates users"
    webApp -> posterController "Manages poster uploads"
    scoringForm -> scoringController "Submits scores"
    scoringForm -> authController "Handles judge token validation"
    assignmentController -> assignmentService "Calls assignment business logic"
    assignmentService -> assignment "Performs assignment algorithm"
    assignmentController -> database "Persists assignments"
    posterController -> database "Manages poster data"
    posterController -> storage "Handles upload URLs"
    scoringController -> database "Saves score data"
    authController -> securityService "Delegates token verification"
    securityService -> authService "External token validation"
  }

  views {
    systemContext posterSys "SystemContext" {
      include *
      autolayout lr
      title "Poster Judging System - Context Diagram"
      description "Overview of system, actors, and external services including billing via Square."
    }

    container posterSys "Containers" {
      include *
      autolayout tb
      title "Poster Judging System - Container Diagram"
      description "Internal containers: UI, API, microservices, and integrations including Square billing system."
    }

    component apiApp "Components" {
      include *
      autolayout tb
      title "API Backend - Component Diagram"
      description "Detailed view of FastAPI components including assignment, scoring, and billing logic."
    }

    styles {
      element "Person" {
        color #ffffff
        background #08427b
        fontSize 22
        shape Person
      }
      element "Software System" {
        background #1168bd
        color #ffffff
      }
      element "Container" {
        background #438dd5
        color #ffffff
      }
      element "Database" {
        shape Cylinder
        background #438dd5
        color #ffffff
      }
      element "Component" {
        background #85bbf0
        color #000000
      }
    }
  }
}