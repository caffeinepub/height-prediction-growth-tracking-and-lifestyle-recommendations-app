
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Apply migration using with-clause

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
};
