import { memoize } from 'proxy-memoize';
import { bonusName } from '@/constants/bonus.ts';
import { RootState } from '@/store/reducers';
import { PaymentMethod } from '@/types';
import { isDevMode } from '@/utils/helpers.ts';
import { isAndroid } from '@/utils/mobile.ts';

export const languageSelector = (state: RootState) => state.ui.language;

export const orderParamsSelector = memoize((state: RootState) => {
  return {
    ...state.order.orderParams,
    language: languageSelector(state),
  };
});

export const orderIdSelector = (state: RootState) => orderParamsSelector(state).orderId;

export const orderInfoSelector = (state: RootState) => state.order.orderInfo!;

export const isAuthenticatedSelector = memoize((state: RootState) => {
  return orderInfoSelector(state)[`${bonusName}Authenticated`];
});

export const defaultEmailSelector = memoize((state: RootState) => {
  return orderInfoSelector(state).defaultEmail;
});

export const bonusPointsSelector = (state: RootState) => state.bonuses.bonusPoints;

export const activePaymentMethodSelector = (state: RootState) => state.ui.activePaymentMethod;

export const bindingsSelector = memoize(
  (state: RootState) => orderInfoSelector(state).bindingItems || [],
);

export const isCertAppliedSelector = memoize((state: RootState) => {
  return !!orderInfoSelector(state).certificateAmount;
});

export const isCertOnlyPaymentSelector = memoize((state: RootState) => {
  const orderInfo = orderInfoSelector(state);
  return orderInfo.certificateAmount === orderInfo.amount;
});

export const availablePaymentMethodsSelector = memoize((state: RootState) => {
  const orderInfo = orderInfoSelector(state);

  const enabledPaymentMethods = {
    bankCard: !isCertOnlyPaymentSelector(state),
    ...(() => {
      if (IS_URAL) {
        return {
          moneywall: orderInfo.showMoneywall,
          upop: orderInfo.showUpop,
          wechat: orderInfo.showWechat,
          fastPay: orderInfo.showFastPay,
          applePay: orderInfo.showApplePay,
          googlePay: orderInfo.showGooglePay,
          sberPay: orderInfo.showSberPay,
          yandexPay: orderInfo.showYandexPay,
          halva: orderInfo.showHalva,
          tinkoff: orderInfo.showTinkoff,
          mirPay:
            orderInfo.showMirPay && !!orderInfo.mirPayUniversalLink && (isAndroid || isDevMode()),
        };
      }
    })(),
  } as Record<PaymentMethod, boolean>;

  const availablePayments = Object.keys(enabledPaymentMethods).filter(
    (key) => enabledPaymentMethods[key as PaymentMethod],
  );
  const paymentOrder = (() => {
    const result = (orderInfo.paymentWayOrder || '').split(',');

    const defaultOrder = (() => {
      if (IS_URAL) {
        return [
          'tinkoff',
          'wechatPay',
          'fastPay',
          'unionPay',
          'sberPay',
          'yandexPay',
          'mirPay',
          'halva',
        ];
      }
      return ['bankCard'];
    })();

    for (const method of defaultOrder) {
      if (!result.includes(method)) {
        result.push(method);
      }
    }
    return result;
  })();

  // Получаем элементы в желаемом порядке
  const orderedPayments = paymentOrder.filter((payment) => availablePayments.includes(payment));

  // Получаем элементы, которых нет в массиве порядка, и добавляем их в конец
  const remainingPayments = availablePayments.filter((payment) => !paymentOrder.includes(payment));

  return orderedPayments.concat(remainingPayments) as PaymentMethod[];
});

export const isBonusBlockDisabledSelector = memoize((state: RootState) => {
  return state.ui.activePaymentMethod !== 'bankCard';
});
