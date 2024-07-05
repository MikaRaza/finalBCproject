const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "donateur",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "montant",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DonationReceived",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "donations",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "donateur",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "montant",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "donationsByDonator",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "nextId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "createDonation",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_donator",
          "type": "address"
        }
      ],
      "name": "getDonationsByDonator",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getDonation",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "donateur",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "montant",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct Donation.DonationInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
const contractAddress = '0xcB0C07930d29f064fE39D93606A3050a98cd5469';

let web3;
let donationContract;
let accounts;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            accounts = await web3.eth.getAccounts();
            donationContract = new web3.eth.Contract(contractABI, contractAddress);
            listDonations();
        } catch (error) {
            console.error("L'utilisateur a refusé l'accès au compte.");
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

async function createDonation() {
  // Demander à l'utilisateur quel montant il souhaite donner
  const donationAmount = prompt("Entrez le montant en ETH que vous souhaitez donner:");
  
  // Vérifier si l'utilisateur a annulé la saisie ou a laissé le champ vide
  if (!donationAmount || donationAmount.trim() === '') {
      console.log('Annulé ou montant vide.');
      return;
  }

  // Convertir le montant en Wei
  const amount = web3.utils.toWei(donationAmount, 'ether');

  try {
      // Envoyer la transaction pour créer la donation
      await donationContract.methods.createDonation().send({ from: accounts[0], value: amount });

      // Mettre à jour la liste des donations après la création
      listDonations();
  } catch (error) {
      console.error('Erreur lors de la création de la donation:', error);
  }
}

async function listDonations() {
    const donationCount = await donationContract.methods.nextId().call();
    const donationDiv = document.getElementById('donations');
    donationDiv.innerHTML = '';

    for (let i = 0; i < donationCount; i++) {
        const donation = await donationContract.methods.getDonation(i).call();
        donationDiv.innerHTML += `
            <div class="donation">
                <p>ID: ${donation.id}</p>
                <p>Donateur: ${donation.donateur}</p>
                <p>Montant: ${web3.utils.fromWei(donation.montant, 'ether')} ETH</p>
                <p>Timestamp: ${new Date(donation.timestamp * 1000).toLocaleString()}</p>
            </div>
        `;
    }
}
