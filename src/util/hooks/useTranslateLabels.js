import { useIntl } from 'react-intl';

export default function useTranslateLabels(items) {
  const { formatMessage } = useIntl();
  return items.map(({ label, value }) => ({
    label: formatMessage({ id: label }),
    value,
  }));
}
