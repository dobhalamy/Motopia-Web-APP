import { TradeInForm, FinanceForm, RideShareForm, ContactForm } from '../constants';

export const formv3 = (form, formData) => {
  let url = '';
  let pageURL = '';
  let pageNameVal = '';
  if (form === 'TradeIn') {
    url = TradeInForm;
    pageURL = 'https://gomotopia.com/trade-in';
    pageNameVal = 'Trade-In';
  } else if (form === 'Ride-share') {
    url = RideShareForm;
    pageURL = 'https://gomotopia.com/ride-share';
    pageNameVal = 'Ride-share';
  } else if (form === 'Finance') {
    url = FinanceForm;
    pageURL = 'https://gomotopia.com/finance';
    pageNameVal = 'Finance';
  } else {
    url = ContactForm;
    pageURL = 'https://gomotopia.com/contact-us';
    pageNameVal = 'Contact-us';
  }

  const xhr = new XMLHttpRequest();
  const data = {
    submittedAt: Date.now(),
    fields: [
      {
        name: 'email',
        value: formData.email
      },
      {
        name: 'firstname',
        value: formData.firstName
      },
      {
        name: 'lastname',
        value: formData.lastName
      },
      {
        name: 'phone',
        value: form === 'Ride-share' ? formData.cellPhone : formData.contactNumber
      },
    ],
    context: {
      pageUri: pageURL,
      pageName: pageNameVal
    },
  };
  const finalData = JSON.stringify(data);
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(finalData);
};
