const model = {
    dataMap: [
      {
        id: 'name',
        acceptedValueTypes: ['string']
      },
      {
        id: 'year',
        acceptedValueTypes: ['number']
      },
      {
        id: 'month',
        acceptedValueTypes: ['number']
      },
      {
        id: 'day',
        acceptedValueTypes: ['number']
      },
      {
        id: 'time',
        acceptedValueTypes: ['string']
      },
      {
        id: 'endYear',
        acceptedValueTypes: ['number']
      },
      {
        id: 'endMonth',
        acceptedValueTypes: ['number']
      },
      {
        id: 'endDay',
        acceptedValueTypes: ['number']
      },
      {
        id: 'endTime',
        acceptedValueTypes: ['string']
      },
      {
        id: 'category',
        acceptedValueTypes: ['string']
      },
      /*
      {
        id: 'display date',
        acceptedValueTypes: ['string']
      },
      {
        id: 'headline',
        acceptedValueTypes: ['string']
      },
      {
        id: 'text',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media',
        acceptedValueTypes: ['url']
      },
      {
        id: 'media credit',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media caption',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media thumbnail',
        acceptedValueTypes: ['string']
      },
      {
        id: 'type',
        acceptedValueTypes: ['string']
      },
      {
        id: 'background',
        acceptedValueTypes: ['string']
      }
      */
    ],
    viewParameters: [
      {
        id: 'fromDate',
        default: new Date() - 1000 * 3600 * 24 * 365
      },
      {
        id: 'toDate',
        default: new Date().getTime()
      }
    ]
  };

  export default model;

