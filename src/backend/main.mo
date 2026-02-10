import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type FormulaResult = {
    name : Text;
    predictedHeightCm : Float;
    enabled : Bool;
  };

  public type HeightPrediction = {
    formulaResults : [FormulaResult];
    predictionCounts : Nat;
    activeFormulaCount : Nat;
    averageHeightCm : Float;
    timestamp : Int;
  };

  public type HeightMeasurement = {
    id : Nat;
    heightCm : Float;
    timestamp : Int;
  };

  public type UserProfile = {
    gender : Text;
    age : Float;
    fatherHeightCm : Float;
    motherHeightCm : Float;
    isMale : Bool;
    currentHeightCm : ?Float;
  };

  public type UserProfileInternal = {
    gender : Text;
    age : Float;
    fatherHeightCm : Float;
    motherHeightCm : Float;
    isMale : Bool;
    currentHeightCm : ?Float;
    activeFormulas : [Nat];
  };

  module HeightMeasurement {
    public func compare(measurement1 : HeightMeasurement, measurement2 : HeightMeasurement) : Order.Order {
      if (measurement1.timestamp < measurement2.timestamp) { #less } else if (measurement1.timestamp > measurement2.timestamp) {
        #greater;
      } else { #equal };
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let growthLogs = Map.empty<Principal, [HeightMeasurement]>();
  let lastPredictions = Map.empty<Principal, HeightPrediction>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getSavedPredictions() : async ?HeightPrediction {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can retrieve predictions");
    };
    lastPredictions.get(caller);
  };

  public query ({ caller }) func getGrowthLogs() : async [HeightMeasurement] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can retrieve growth logs");
    };
    switch (growthLogs.get(caller)) {
      case (?logs) { logs };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addGrowthLog(heightCm : Float) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add growth logs");
    };

    let newMeasurement : HeightMeasurement = {
      id = Time.now().toNat();
      heightCm;
      timestamp = Time.now();
    };

    let updatedLogs = switch (growthLogs.get(caller)) {
      case (?data) { data.concat([newMeasurement]) };
      case (null) { [newMeasurement] };
    };

    growthLogs.add(caller, updatedLogs);
  };

  public shared ({ caller }) func updateGrowthLog(id : Nat, newHeight : Float) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update growth logs");
    };

    let logs = switch (growthLogs.get(caller)) {
      case (null) { Runtime.trap("No growth logs found") };
      case (?data) { data };
    };

    let updatedLogs = logs.map(
      func(log) { if (log.id == id) { { log with heightCm = newHeight } } else { log } }
    );

    growthLogs.add(caller, updatedLogs);
  };

  public shared ({ caller }) func deleteGrowthLog(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete growth logs");
    };

    let logs = switch (growthLogs.get(caller)) {
      case (null) { Runtime.trap("No growth logs found") };
      case (?data) { data };
    };

    let updatedLogs = logs.filter(func(log) { log.id != id });

    growthLogs.add(caller, updatedLogs);
  };

  public shared ({ caller }) func savePrediction(prediction : HeightPrediction) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save predictions");
    };
    lastPredictions.add(caller, prediction);
  };

  public query ({ caller }) func getGrowthLogsChronological() : async [HeightMeasurement] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can retrieve growth logs");
    };

    switch (growthLogs.get(caller)) {
      case (?logs) { logs.sort() };
      case (null) { [] };
    };
  };
};
