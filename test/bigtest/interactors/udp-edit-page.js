import {
  attribute,
  clickable,
  interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

@interactor class HarvestingStatusSelect {
  static defaultScope = 'select[name="harvestingConfig.harvestingStatus"]';
  value = value();
}

@interactor class HarvestingViaSelect {
  static defaultScope = 'select[name="harvestingConfig.harvestVia"]';
  value = value();
}

@interactor class ReportReleaseSelect {
  static defaultScope = 'select[id="addudp_reportrelease"]';
  value = value();
}

@interactor class ReportTypeSelect {
  static defaultScope = 'select[id=""]';
}

@interactor class DeleteUDPConfirmation {
  static defaultScope = '#delete-udp-confirmation';
  clickCancelDeleteUDP = clickable('#clickable-delete-udp-confirmation-cancel');
}

@interactor class ConfirmationModal {
  static defaultScope = '#clear-report-selection-confirmation';
  clickConfirmClearReportsButton = clickable('[data-test-confirmation-modal-confirm-button]');
  clickCancelClearReportsButton = clickable('[data-test-confirmation-modal-cancel-button]');
}

@interactor class CustomerId {
  static defaultScope = 'input[id="addudp_customerid"]';
  required = attribute('required');
}

@interactor class Platform {
  static defaultScope = 'input[id="addudp_platform"]';
}

export default @interactor class UDPEditPage {
  static defaultScope = '[data-test-form-page]';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  harvestingStatusSelect = new HarvestingStatusSelect();
  harvestingViaSelect = new HarvestingViaSelect();
  deleteUDPConfirmation = new DeleteUDPConfirmation();

  clickDeleteUDP = clickable('#clickable-delete-udp');

  reportReleaseSelect = new ReportReleaseSelect();
  reportTypeSelect = new ReportTypeSelect();
  clickAddReportButton = clickable('[data-test-repeatable-field-add-item-button]');
  confirmationModal = new ConfirmationModal();

  customerId = new CustomerId();
  platform = new Platform();
}
