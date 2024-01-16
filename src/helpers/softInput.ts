import {AvoidSoftInput} from 'react-native-avoid-softinput';

export const enableSoftInput = () => {
  // This should be run when screen gains focus - enable the module where it's needed
  AvoidSoftInput.setShouldMimicIOSBehavior(true);
  AvoidSoftInput.setEnabled(true);
  return () => {
    // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
    AvoidSoftInput.setEnabled(false);
    AvoidSoftInput.setShouldMimicIOSBehavior(false);
  };
};
