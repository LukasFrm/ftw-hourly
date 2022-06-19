import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';

import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { findOptionsForSelectFilter } from '../../util/search';
import { required, composeValidators } from '../../util/validators';

import { Form, Button, FieldCheckboxGroup, FieldTextInput } from '../../components';
import config from '../../config';
import css from './EditListingOnlineOfflineForm.module.css';


export const EditListingOnlineOfflineFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateError,
        updateInProgress,
        filterConfig,
        name,
        values
      } = formRenderProps;
      
      const onlineSessionsProvidedByMessage = intl.formatMessage({
        id: 'EditListingOnlineOfflineForm.onlineSessionsProvidedByMessage',
      });

      const onlineSessionsProvidedByPlaceholder = intl.formatMessage({
        id: 'EditListingOnlineOfflineForm.onlineSessionsProvidedByPlaceholder',
      });

      const selectionRequiredMessage = intl.formatMessage({
        id: 'EditListingOnlineOfflineForm.selectionRequiredMessage',
      });

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingOnlineOfflineForm.updateFailed" />
        </p>
      ) : null;

      const { onlineOfflineOpts = [] } = values
      const eitherCheckboxClicked = !!onlineOfflineOpts.length
      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress || !eitherCheckboxClicked
      const options = findOptionsForSelectFilter('onlineOfflineOpts', filterConfig);
      const onlineSessionsSelected = onlineOfflineOpts.includes('onlineClassesSelected')

      return (
        <Form className={classes}
          onSubmit={handleSubmit}
        >
          {errorMessage}
          <FieldCheckboxGroup
            className={css.onlineOfflineOptions}
            id={name}
            name={name}
            options={options}
            validate={composeValidators(required(selectionRequiredMessage))}
          />
          {onlineSessionsSelected &&
            <FieldTextInput
              id="onlineSessionsProvidedBy"
              name="onlineSessionsProvidedBy"
              className={css.description}
              type="textarea"
              label={onlineSessionsProvidedByMessage}
              placeholder={onlineSessionsProvidedByPlaceholder}
            />
          }
          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingOnlineOfflineFormComponent.defaultProps = { // TODO
  selectedPlace: null,
  updateError: null,
  filterConfig: config.custom.filters,
};

EditListingOnlineOfflineFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  onlineOfflineOptions: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
  filterConfig: propTypes.filterConfig,
};

export default compose(injectIntl)(EditListingOnlineOfflineFormComponent);
