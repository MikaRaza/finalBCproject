const Donation = artifacts.require("Donation");

contract("Donation", (accounts) => {
  it("créer une donation", async () => {
    const instance = await Donation.deployed();
    const result = await instance.createDonation({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether'),
    });
    assert.equal(
      result.logs[0].event,
      "DonationReceived",
      "L'événement DonationReceived n'a pas été émis."
    );
  });

  it("lister les donations par donateur", async () => {
    const instance = await Donation.deployed();
    const donations = await instance.getDonationsByDonator(accounts[0]);
    assert.equal(donations.length, 1, "La donation n'a pas été enregistrée correctement.");
  });

  it("retourner les détails de la donation", async () => {
    const instance = await Donation.deployed();
    const donation = await instance.getDonation(0);
    assert.equal(donation.id, 0, "ID incorrect.");
    assert.equal(donation.donateur, accounts[0], "adresse incorrecte.");
    assert.equal(
      donation.montant,
      web3.utils.toWei('1', 'ether'),
      "Le montant incorrect."
    );
  });
});
