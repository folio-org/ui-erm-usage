import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';

import { InfoPopover } from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../../../util/fetchWithDefaultOptions';

const AggregatorContactInfo = ({
  aggregatorId,
  stripes,
}) => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchAggregator = (id) => {
      return fetchWithDefaultOptions(
        stripes.okapi,
        `/aggregator-settings/${id}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
        .then((response) => {
          if (!response.ok) {
            return Promise.reject(response);
          }
          return response.json();
        })
        .catch(async (resp) => {
          const err = await resp.text().then((text) => text);
          return Promise.reject(err);
        })
        .then((json) => {
          setContact(json.accountConfig.displayContact);
        })
        .catch((error) => {
          setContact(`Error retrieving aggregator info by id: ${error} `);
        });
    };

    fetchAggregator(aggregatorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggregatorId]);

  const renderContactInfo = (contactInfo) => {
    if (!isEmpty(contactInfo)) {
      return <InfoPopover content={contactInfo} />;
    } else {
      return null;
    }
  };

  return <div>{renderContactInfo(contact)}</div>;
};

AggregatorContactInfo.propTypes = {
  aggregatorId: PropTypes.string.isRequired,
  stripes: PropTypes.object,
};

export default AggregatorContactInfo;
