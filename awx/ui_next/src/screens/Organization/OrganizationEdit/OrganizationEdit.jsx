import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CardBody } from '@patternfly/react-core';

import { OrganizationsAPI } from '@api';
import { Config } from '@contexts/Config';

import OrganizationForm from '../shared/OrganizationForm';

function OrganizationEdit({ history, organization }) {
  const detailsUrl = `/organizations/${organization.id}/details`;
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (
    values,
    groupsToAssociate,
    groupsToDisassociate
  ) => {
    try {
      await OrganizationsAPI.update(organization.id, values);
      await Promise.all(
        groupsToAssociate.map(id =>
          OrganizationsAPI.associateInstanceGroup(organization.id, id)
        )
      );
      await Promise.all(
        groupsToDisassociate.map(id =>
          OrganizationsAPI.disassociateInstanceGroup(organization.id, id)
        )
      );
      history.push(detailsUrl);
    } catch (error) {
      setFormError(error);
    }
  };

  const handleCancel = () => {
    history.push(detailsUrl);
  };

  return (
    <CardBody>
      <Config>
        {({ me }) => (
          <OrganizationForm
            organization={organization}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            me={me || {}}
          />
        )}
      </Config>
      {formError ? <div>error</div> : null}
    </CardBody>
  );
}

OrganizationEdit.propTypes = {
  organization: PropTypes.shape().isRequired,
};

OrganizationEdit.contextTypes = {
  custom_virtualenvs: PropTypes.arrayOf(PropTypes.string),
};

export { OrganizationEdit as _OrganizationEdit };
export default withRouter(OrganizationEdit);
