export interface ServiceItem {
    id: string;
    name: string;
    description: string;
    price: number;
    addedDate: string; // When this service was added
  }

export interface User {
    // MongoDB internal ID
    _id?: string; 

    // Required fields (No '?' because Mongoose requires them)
    contractorType: string;
    packagePrice: number;
    role: string;

    // Optional fields (Using '?' because Mongoose doesn't mark them required)
    businessName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    
    name?: string;
    emailAddress?: string;
    phoneNumber?: string; 
    title?: string;
    
    secondaryContactName?: string;
    secondaryContactEmailAddress?: string;
    secondaryContactPhoneNumber?: string;
    
    hoursWorked?: string;
    driverSchedule?: string;
    pay?: string;
    ratePerStop?: string;
    stopsPerDay?: string;
    
    benefits?: string;
    truckSize?: string;
    terminalAddress?: string;
    
    clientID?: string;
    userID?: string;
    systemAccessPassword?: string;
    sequrityQuestionAnswer?: string; // Note: You have a typo 'sequrity' in model, interface must match it!
    indeedUsernameOrEmail?: string;
    indeedPassword?: string;
    
    authorizedDate?: string; 
    authorizedSignature?: string;
    position?: string;
    companyName?: string;
    
    username?: string;
    email?: string;
    password?: string;

    // Automatically added by { timestamps: true }
    createdAt?: Date;
    updatedAt?: Date;

    activeServices?: ServiceItem[];
    nextBillingDate?: string;
}