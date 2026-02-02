interface AddressInfoProps {
  zipcode: string;
  street: string;
  neighborhood: string;
  state: string;
}

class AddressInfo {
  props: AddressInfoProps;
  constructor(props: AddressInfoProps) {
    this.props = props;
  }
}

export { AddressInfo };
