import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import config from '../../config.js';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';

import { ListingLink } from '../../components';
import { EditListingOnlineOfflineForm } from '../../forms';

import css from './EditListingOnlineOfflinePanel.module.css';

const EditListingOnlineOfflinePanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);

  const { publicData, onlineSessionsProvidedBy } = currentListing.attributes; 
  const onlineOfflineOpts = publicData && publicData.onlineOfflineOpts; 
  const initialValues = { onlineOfflineOpts, onlineSessionsProvidedBy  }; 

  const ONLINE_OFFLINE_NAME = 'onlineOfflineOpts'; 

  const panelTitle = currentListing.id ? (
    <FormattedMessage
      id="EditListingOnlineOfflinePanel.createListingTitle"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingOnlineOfflinePanel.createListingTitle" />
  );

  const onlineOfflineOptions = findOptionsForSelectFilter('onlineOfflineOpts', config.custom.filters);
  const onlineClassesNotSelected = !onlineOfflineOpts.includes('onlineClassesSelected')
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingOnlineOfflineForm
        className={css.form}
        name={ONLINE_OFFLINE_NAME}
        initialValues={initialValues}
        onSubmit={values => {
          let { onlineOfflineOpts = [], onlineSessionsProvidedBy = '' } = values;
          const updatedValues = {
            publicData: { onlineOfflineOpts },
          };
          if (!!onlineSessionsProvidedBy.length) {
            updatedValues.publicData.onlineSessionsProvidedBy = onlineSessionsProvidedBy
          }
          else if (onlineClassesNotSelected) {
              delete updatedValues.publicData.onlineSessionsProvidedBy
          }
          onSubmit(updatedValues);
        }}

        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
        onlineOfflineOptions={onlineOfflineOptions}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingOnlineOfflinePanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingOnlineOfflinePanel.propTypes = {
  className: string,
  rootClassName: string,
  listing: object,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingOnlineOfflinePanel;
