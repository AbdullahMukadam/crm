
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


export const LeadFormOptions = [
    {
        id: "name",
        label: "Your Full Name",
        mapping: "Full Name",
        type: "input",
        required: true,
        order: 1
    },
    {
        id: "email",
        label: "Your Email Address",
        mapping: "Email Address",
        type: "input",
        required: true,
        order: 2
    },
    {
        id: "companyName",
        label: "Your Company Name",
        mapping: "Company Name",
        type: "input",
        required: false,
        order: 3
    },
    {
        id: "mobileNumber",
        label: "Your Mobile Number",
        mapping: "Mobile Number",
        type: "input",
        required: false,
        order: 4
    },
    {
        id: "note",
        label: "Tell us about your Need",
        mapping: "Note",
        type: "textArea",
        required: false,
        order: 5
    }
];

export const LeadFormGenerationOptions = [
    {
        id: "twitter",
        Label: "X (Twitter)"
    },
    {
        id: "google",
        Label: "Google Ads"
    },
    {
        id: "instagram",
        Label: "Instagram"
    },
    {
        id: "linkedin",
        Label: "LinkedIn"
    },
    {
        id: "normal",
        Label: "Basic"
    },
]