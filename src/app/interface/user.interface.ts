interface User {

    username?: string,
    email?: string,
    password?: string,

    contractorType?: string;
    packagePrice?: number;

    businessName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;

    name?: string;
    emailAddress?: string;
    phoneNumber?: string; // Changed to string (Phone numbers often start with 0 or +)
    title?: string;

    secondaryContactName?: string;
    secondaryContactEmailAddress?: string;
    secondaryContactPhoneNumber?: string; // Changed to string

    hoursWorked?: string; // Changed to number
    driverSchedule?: string;
    pay?: string; // Changed to number
    payType?: string;
    ratePerStop?: string; // Changed to number
    stopsPerDay?: string; // Changed to number
    benefits?: string;
    truckSize?: string;
    terminalAddress?: string;

    clientID?: string;
    userID?: string;
    systemAccessPassword?: string;
    sequrityQuestionAnswer?: string;
    indeedUsernameOrEmail?: string;
    indeedPassword?: string;

    authorizedSignature?: string;
    authorizedDate?: string; // Changed to string to match your Date picker output
    position?: string;
    companyName?: string;
    role?: 'client' | 'admin';
}

export type { User };