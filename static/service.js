const getQueryParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
};

const serviceData = {
    'Police Reports': {
        title: 'Police Reports',
        description: 'File a formal police report for theft, assault, property damage, or other criminal incidents.',
        details: 'Use this service to create an official report with your local police station. You can provide full incident details, evidence, and witness information to support the report.',
        action: 'complaint',
        externalLink: 'https://www.interpol.int/en/How-we-work/Police-services/Interpol-Notices',
        externalLabel: 'Interpol Police Services',
    },
    'Traffic Violation Report': {
        title: 'Traffic Violation Report',
        description: 'Submit a complaint about traffic violations and unsafe driving behaviors.',
        details: 'This service helps citizens report traffic violations such as reckless driving, illegal parking, and unsafe behavior on the roads.',
        action: 'complaint',
        externalLink: 'https://www.fia.com/road-safety',
        externalLabel: 'International Road Safety',
    },
    'Public Records Request': {
        title: 'Public Records Request',
        description: 'Request official police records and documentation related to your case.',
        details: 'Request access to incident reports, clearance certificates, or other public police records according to local regulations.',
        action: 'contact',
        externalLink: 'https://www.accessinfo.org/',
        externalLabel: 'Public Records Information',
    },
    'Safety Advice': {
        title: 'Safety Advice',
        description: 'Read police safety advice for personal protection and community security.',
        details: 'National and local police provide best practices for staying safe in the community, including home security, travel safety, and emergency response tips.',
        action: 'index',
        externalLink: 'https://www.et.police.gov/',
        externalLabel: 'Ethiopian Police Safety Tips',
    },
    'Community Policing': {
        title: 'Community Policing',
        description: 'Learn about community policing initiatives and partnerships.',
        details: 'Community policing builds trust between police and citizens through outreach programs, local meetings, and shared public safety goals.',
        action: 'index',
        externalLink: 'https://www.unodc.org/',
        externalLabel: 'Community Policing Resources',
    },
    'Emergency Numbers': {
        title: 'Emergency Numbers',
        description: 'Find the important emergency helplines for police, fire, and ambulance.',
        details: 'Save these emergency contact numbers and use them immediately when you need urgent police or medical assistance.',
        action: 'index',
        externalLink: 'https://www.iphc.org/',
        externalLabel: 'International Emergency Response',
    },
    'Victim Support': {
        title: 'Victim Support',
        description: 'Access support tools for crime victims and affected families.',
        details: 'Victim support services offer guidance, counseling, and legal assistance for people affected by crime and violence.',
        action: 'contact',
        externalLink: 'https://www.unodc.org/victim_support',
        externalLabel: 'Victim Support Resources',
    },
    'Lost & Found': {
        title: 'Lost & Found',
        description: 'Report lost property or claim found items at a police station.',
        details: 'Police stations manage lost and found items for the public. Report your missing items or collect recovered property.',
        action: 'contact',
        externalLink: 'https://www.police.uk/pu/contact/police-stations',
        externalLabel: 'Police Station Finder',
    },
    'Public Meetings': {
        title: 'Public Meetings',
        description: 'Learn about upcoming community-police meetings and forums.',
        details: 'Join public meetings to discuss safety issues, provide feedback, and stay informed about local policing activities.',
        action: 'index',
        externalLink: 'https://www.interpol.int/en/News-and-Events',
        externalLabel: 'Police Events and Meetings',
    },
    'Find Your Station': {
        title: 'Find Your Station',
        description: 'Locate the nearest police station in your city or region.',
        details: 'Use the police station finder to get contact details, addresses, and directions to the nearest station.',
        action: 'contact',
        externalLink: 'https://www.police.gov.et/',
        externalLabel: 'Ethiopian Police Official Site',
    },
    'Citizen Help Desk': {
        title: 'Citizen Help Desk',
        description: 'Get help with police services, complaints, and public inquiries.',
        details: 'Citizen help desks handle general inquiries, service support, and guidance for using police services.' ,
        action: 'contact',
        externalLink: 'https://www.un.org/ruleoflaw',
        externalLabel: 'Public Service Support',
    },
    'Police Commission Contacts': {
        title: 'Police Commission Contacts',
        description: 'Get contact details for the police commission and oversight offices.',
        details: 'Reach out to the police commission for complaints, feedback, or official communications with leadership.',
        action: 'contact',
        externalLink: 'https://www.nec.gov.et/',
        externalLabel: 'Commission Contact Info',
    },
};

const setServiceContent = () => {
    const topic = getQueryParam('topic');
    const service = serviceData[topic];
    const titleEl = document.getElementById('service-title');
    const descriptionEl = document.getElementById('service-description');
    const detailsEl = document.getElementById('service-details');
    const actionLink = document.getElementById('service-action');
    const externalLink = document.getElementById('service-external');

    if (!service) {
        titleEl.textContent = 'Service not found';
        descriptionEl.textContent = 'The selected service is not available. Use the portal menu to choose a valid police service.';
        detailsEl.textContent = 'Return to the homepage and select a service from the menu.';
        actionLink.textContent = 'Back to portal';
        actionLink.href = 'index.html';
        externalLink.style.display = 'none';
        return;
    }

    titleEl.textContent = service.title;
    descriptionEl.textContent = service.description;
    detailsEl.textContent = service.details;
    document.title = `${service.title} | Adama Police Commission`;

    if (service.action === 'complaint') {
        actionLink.textContent = 'Submit a complaint';
    } else if (service.action === 'contact') {
        actionLink.textContent = 'Contact support';
    } else {
        actionLink.textContent = 'Return to portal';
    }
    actionLink.href = `${service.action}.html`;
    actionLink.style.display = 'inline-flex';

    if (service.externalLink) {
        externalLink.textContent = service.externalLabel;
        externalLink.href = service.externalLink;
        externalLink.style.display = 'inline-flex';
    } else {
        externalLink.style.display = 'none';
    }
};

window.addEventListener('DOMContentLoaded', () => {
    setServiceContent();
});