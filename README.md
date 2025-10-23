# Coastal Claims Connect - Talent Partner Network

## Project Overview

This repository contains the **Talent Partner Network** system for Coastal Claims Services, providing comprehensive multi-state license tracking, partner management, and deployment coordination.

## Recent Updates (October 2025)

### Enhanced Talent Partner Network (`TalentPartnerNetwork.tsx`)
The original 470-line `Talent.tsx` has been significantly expanded to 1,787 lines with enterprise-grade features:

#### New Features Added:
- **Multi-State License Tracking**: Track adjuster licenses across all 50 states + DC with expiration monitoring
- **Advanced Filtering System**: 
  - Filter by multiple states (must be licensed in ALL selected)
  - Current location filtering
  - Availability status (Available, Deployed, Unavailable)
  - License status (Active, Expiring, Expired)
  - Specializations (Property, Auto, Catastrophe, etc.)
- **Multiple View Modes**:
  - **States View**: Geographic overview with resource counts per state
  - **Adjusters View**: Card-based adjuster directory
  - **Partners View**: External partner/vendor management
  - **Combined View**: Detailed list with all resources
  - **Deployment View**: Real-time deployment dashboard
- **Partner Registration**: 8-step registration workflow for new partners
- **Deployment Management**: Deploy adjusters to specific states with license verification
- **Real-time Statistics**: Dashboard metrics for coverage, capacity, and alerts
- **Role-Based Access**: Admin controls for sensitive operations

#### New Components Added:
Located in `/src/components/talent-partner-network/`:
- `PartnerRegistration.tsx` - Multi-step partner onboarding workflow
- `AdjusterOnboarding.tsx` - Adjuster registration and license management
- `AdminApproval.tsx` - Admin approval interface for new registrations
- `AnalyticsDashboard.tsx` - Analytics and reporting dashboard
- `PartnerProfile.tsx` - Detailed partner profile views

#### Data Models:
- **Adjuster**: Internal adjusters with multi-state licenses, specializations, availability
- **Partner**: External vendors with service areas, capacity tracking, contract status
- **License**: State-specific licenses with expiration tracking and status monitoring

#### Backend Integration:
- MongoDB database connection via `/api/talent/adjusters` and `/api/talent/partners`
- Real-time data synchronization
- Mock data generators for development/testing

## Technologies Used

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn-ui + Tailwind CSS
- **Icons**: Lucide React
- **Database**: MongoDB (via backend API)
- **Routing**: React Router v6
- **State Management**: React Context API

## Installation & Setup

```sh
# Clone the repository
git clone https://github.com/Coastal-Claims-Services/coastal-claims-connect.git

# Navigate to project directory
cd coastal-claims-connect

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000
```

## Project Structure

```
src/
├── pages/
│   ├── Talent.tsx (Legacy - 470 lines)
│   └── TalentPartnerNetwork.tsx (Enhanced - 1,787 lines)
├── components/
│   ├── talent-partner-network/
│   │   ├── PartnerRegistration.tsx
│   │   ├── AdjusterOnboarding.tsx
│   │   ├── AdminApproval.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   └── PartnerProfile.tsx
│   └── ExternalPartners.tsx
```

## Deployment

This project was originally built with Lovable and can be deployed via:

1. **Lovable Platform**: Visit [Lovable Project](https://lovable.dev/projects/24259ec7-8296-4810-bded-42dfa7799071)
2. **Custom Deployment**: Build and deploy to any static hosting service
3. **Vercel/Netlify**: Direct GitHub integration

## Custom Domain

To connect a custom domain, navigate to Project > Settings > Domains in Lovable.

[Setting up a custom domain guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Contributing

This repository is integrated with the main employee portal at:
`https://github.com/Coastal-Claims-Services/coastalclaims-employee-portal`

Changes pushed here can be synced with the employee portal as needed.

## License

© 2025 Coastal Claims Services. All rights reserved.
