const updatePersonalDetails = (foundUser, req) => {
  foundUser.personalDetails.firstName =
    req.body?.firstName || foundUser.personalDetails.firstName;
  foundUser.personalDetails.lastName =
    req.body?.lastName || foundUser.personalDetails.lastName;
  foundUser.personalDetails.handleName =
    req.body?.handleName || foundUser.personalDetails.handleName;
  foundUser.personalDetails.bio =
    req.body?.bio || foundUser.personalDetails.bio;
  foundUser.personalDetails.location =
    req.body?.location || foundUser.personalDetails.location;
  foundUser.personalDetails.website =
    req.body?.website || foundUser.personalDetails.website;
  foundUser.personalDetails.profilePic.picUrl =
    req.body?.profilePic?.picUrl || foundUser.personalDetails.profilePic.picUrl;
  foundUser.personalDetails.profilePic.picAlt =
    req.body?.profilePic?.picAlt || foundUser.personalDetails.profilePic.picAlt;
  foundUser.personalDetails.profileBackground.bgUrl =
    req.body?.profileBackground?.bgUrl ||
    foundUser.personalDetails.profileBackground.bgUrl;
  foundUser.personalDetails.profileBackground.bgAlt =
    req.body?.profileBackground?.bgAlt ||
    foundUser.personalDetails.profileBackground.bgAlt;
};

module.exports = { updatePersonalDetails };
