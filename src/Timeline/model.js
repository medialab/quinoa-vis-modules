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
      }
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

