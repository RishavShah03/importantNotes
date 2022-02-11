//test for react native project
import { act, fireEvent } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { renderScreen } from '../../utils/TestUtils';
import { AccountVerificationParams } from '../../../types';
import { AuthFactory } from '../../factories/redux/AuthFactory';
import { DefaultAuthMeResponse } from '../../fixtures/api/auth/DefaultAuthMeResponse';
import {
  AdministrativeAreaRequestCountryEnum,
  AdministrativeAreaRequestStateOrProvinceEnum,
  AdministrativeAreaResponseStateOrProvinceEnum,
  AgentControllerApi,
} from '../../openapi/yenta';
import { assertAxiosSpyCalledWith, mockAxiosApi } from '../../utils/MockUtils';
import {
  createAdministrativeAreaResponse,
  createLicenseResponse,
} from '../../testUtils/FakerUtils';
import LicenseVerificationIndex from './LicenseVerificationIndex';

describe('LicenseVerificationIndex', () => {
  test('it should complete license verification', async () => {
    const spy = mockAxiosApi<
      typeof AgentControllerApi.prototype.updateAgentLicenseBoardMlsById
    >(
      AgentControllerApi,
      AgentControllerApi.prototype.updateAgentLicenseBoardMlsById,
      DefaultAuthMeResponse,
    );

    const {
      getByText,
      getAllByText,
      getByA11yLabel,
      getAllByTestId,
      UNSAFE_getByType: getByType,
    } = await renderScreen<
      AccountVerificationParams,
      'LicenseVerificationIndex'
    >(LicenseVerificationIndex, undefined, {
      auth: AuthFactory.withLoggedInUser({
        ...DefaultAuthMeResponse,
        licenses: [],
      }),
    });

    expect(getByText('Edit License')).toBeTruthy();
    expect(getByText('There are no licenses to display.')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Add'));
    });

    await act(async () => {
      fireEvent(
        getAllByTestId('ios_picker')[0],
        'onValueChange',
        AdministrativeAreaRequestCountryEnum.UnitedStates,
        1,
      );
    });

    await act(async () => {
      fireEvent(
        getAllByTestId('ios_picker')[1],
        'onValueChange',
        AdministrativeAreaRequestStateOrProvinceEnum.Alaska,
        1,
      );

      fireEvent.changeText(getByA11yLabel('licenses[0].number'), '123123');
    });

    const date = DateTime.local(2030, 6, 1).startOf('month');
    await act(async () => {
      fireEvent.press(getByA11yLabel('licenses[0].expirationDate'));
    });
    await act(async () => {
      fireEvent(getByType(DateTimePickerModal), 'onConfirm', date.toJSDate());
    });

    await act(async () => {
      fireEvent.press(getAllByText('Save')[0]);
    });

    assertAxiosSpyCalledWith<
      typeof AgentControllerApi.prototype.updateAgentLicenseBoardMlsById
    >(spy, DefaultAuthMeResponse.id!, {
      boardIds: DefaultAuthMeResponse.boards.map((board) => board.id!),
      licenses: [
        {
          active: true,
          administrativeAreaRequest: {
            country: AdministrativeAreaRequestCountryEnum.UnitedStates,
            stateOrProvince:
              AdministrativeAreaRequestStateOrProvinceEnum.Alaska,
          },
          expirationDate: '2030-06-01',
          knownComplaints: false,
          number: '123123',
        },
      ],
      mlsIds: DefaultAuthMeResponse.mls.map((mls) => mls.id!),
    });
  });

  test('only one licence per state is allowed', async () => {
    const { getByText, getAllByText } = await renderScreen<
      AccountVerificationParams,
      'LicenseVerificationIndex'
    >(LicenseVerificationIndex, undefined, {
      auth: AuthFactory.withLoggedInUser({
        ...DefaultAuthMeResponse,
        licenses: [
          createLicenseResponse({
            administrativeArea: createAdministrativeAreaResponse({
              stateOrProvince:
                AdministrativeAreaResponseStateOrProvinceEnum.Alabama,
            }),
          }),
          createLicenseResponse({
            administrativeArea: createAdministrativeAreaResponse({
              stateOrProvince:
                AdministrativeAreaResponseStateOrProvinceEnum.Alabama,
            }),
          }),
        ],
      }),
    });

    expect(getByText('Edit License')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getAllByText('Save')[0]);
    });

    expect(getByText('Only one license per state is allowed')).toBeTruthy();
  });
});