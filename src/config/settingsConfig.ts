
export const CreatorSettingsItems = [
    {
        label: 'Account',
        href: '/dashboard/creator/settings/account',
        description: 'Update your account details and preferences.',
    },
    {
        label: 'Team',
        href: '/dashboard/creator/settings/team',
        description: 'Manage your team members and permissions.',
    },
    {
        label: 'Branding',
        href: '/dashboard/creator/settings/branding',
        description: 'Customize your brand settings and appearance.',
    },
    {
        label: 'Billing',
        href: '/dashboard/creator/settings/billing',
        description: 'View your billing history and manage payment methods.',
    },
] as const;

// id           String   @id @default(cuid())
// name         String
// email        String
// companyName  String?
// mobileNumber String?
// note         String?

export const LeadFormOptions = [
    {
        label : "Full Name",
        type : "input",
        required : true
    },
    {
        label : "Email Address",
        type : "input",
        required : true
    },
    {
        label : "Company Name",
        type : "input",
        required : false
    },
    {
        label : "Mobile Number",
        type : "input",
        required : false
    },
    {
        label : "Note",
        type : "textArea",
        required : false
    }
] as const;