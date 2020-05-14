import styled from 'styled-components/native';

export const Container = styled.View`
  position: absolute;
  bottom: 0px;

  flex-direction: row;
  background: #e83f5b;

  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
`;

export const CartPricing = styled.Text`
  padding: 20px;
`;

export const CartTotalPrice = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  line-height: 23px;
`;

export const CartButton = styled.TouchableOpacity`
  flex-direction: row;
  background: #e83f5b;

  flex: 1;
  padding: 20px 20px;
  justify-content: space-between;
  align-items: center;
`;

export const CartButtonText = styled.Text`
  font-weight: bold;
  color: #fff;
  margin-left: 15px;
  flex: 1;
  margin-right: auto;
`;
