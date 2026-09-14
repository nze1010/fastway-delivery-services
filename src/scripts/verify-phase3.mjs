import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBeELhqKwft0x_t0mSYrHdh6kk0uvfpDaQ',
  authDomain: 'delivery-67506.firebaseapp.com',
  projectId: 'delivery-67506',
  storageBucket: 'delivery-67506.firebasestorage.app',
  messagingSenderId: '732153528573',
  appId: '1:732153528573:web:d2fc3340697f6ca3bb3e94',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function runVerification() {
  console.log('=== STARTING FASTWAY DELIVERY PHASE 3 BACKEND VERIFICATION ===');
  console.log('Target Firebase Project:', firebaseConfig.projectId);

  // 1. Authenticate Admin User
  let user;
  const adminEmail = 'admin@fastwaydelivery.com';
  const adminPass = 'FastwayAdmin2026!';

  console.log('\n1. Testing Firebase Authentication...');
  try {
    const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
    user = cred.user;
    console.log('✓ Successfully signed in existing admin user:', user.email, 'UID:', user.uid);
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      console.log('Creating initial admin user account...');
      const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
      user = cred.user;
      console.log('✓ Successfully created initial admin user:', user.email, 'UID:', user.uid);
    } else {
      throw err;
    }
  }

  // 2. Ensure Profile Document in users/{uid}
  console.log('\n2. Verifying/Writing Admin Profile in Firestore...');
  const profileRef = doc(db, 'users', user.uid);
  await setDoc(profileRef, {
    uid: user.uid,
    email: adminEmail,
    displayName: 'Lead Logistics Administrator',
    role: 'super_admin',
    assignedHub: 'Global Control Center',
    isActive: true,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  }, { merge: true });
  const profileSnap = await getDoc(profileRef);
  console.log('✓ Admin profile document confirmed:', profileSnap.data());

  // 3. Register Consignment in shipments collection
  console.log('\n3. Creating New Consignment (Admin Authorized Write)...');
  const trackingNumber = 'FW-829415';
  const shipmentRef = doc(collection(db, 'shipments'));
  const shipmentId = shipmentRef.id;

  const newShipment = {
    trackingNumber,
    serviceType: 'express-parcel',
    status: 'registered',
    originHub: 'London Heathrow Gateway (LHR-01)',
    destinationHub: 'Frankfurt Central Hub (FRA-02)',
    currentLocation: 'London Heathrow Gateway (LHR-01)',
    assignedTransportMode: 'Boeing 777-F / Fastway Air Logistics',
    estimatedDeliveryDate: '2026-09-18',
    notes: 'High priority international consignment. Verified secure cargo.',
    cost: 145.50,
    paymentStatus: 'paid',
    sender: {
      name: 'Global Tech Distribution Ltd',
      phone: '+44 20 7946 0991',
      email: 'logistics@globaltechdist.com',
      address: {
        street: '18 Cargo Way, Compass Centre',
        city: 'London',
        state: 'Greater London',
        country: 'United Kingdom',
        postalCode: 'TW6 2GW',
      },
    },
    receiver: {
      name: 'EuroTech Dynamics GmbH',
      phone: '+49 69 9758 2300',
      email: 'operations@eurotechdynamics.de',
      address: {
        street: 'Mainzer Landstraße 180',
        city: 'Frankfurt am Main',
        state: 'Hesse',
        country: 'Germany',
        postalCode: '60327',
      },
    },
    packageDetails: {
      description: 'Precision Telemetry Sensors & Secure Microcontrollers',
      category: 'electronics',
      weightKg: 4.8,
      quantity: 2,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
    serverUpdatedAt: serverTimestamp(),
  };

  await setDoc(shipmentRef, newShipment);
  console.log(`✓ Consignment created with Document ID: ${shipmentId} & Tracking Number: ${trackingNumber}`);

  // 4. Append Milestone Events in Subcollection
  console.log('\n4. Appending Tracking Milestones to Subcollection...');
  const eventsCollection = collection(db, 'shipments', shipmentId, 'trackingEvents');
  
  // Milestone 1
  const event1Ref = doc(eventsCollection);
  await setDoc(event1Ref, {
    id: event1Ref.id,
    shipmentId,
    status: 'registered',
    title: 'Consignment Manifest Registered',
    description: 'Documentation received and electronic customs declaration approved.',
    location: 'London Heathrow Gateway (LHR-01)',
    timestamp: '2026-09-14T08:00:00.000Z',
    createdBy: user.uid,
    serverTimestamp: serverTimestamp(),
  });

  // Milestone 2
  const event2Ref = doc(eventsCollection);
  await setDoc(event2Ref, {
    id: event2Ref.id,
    shipmentId,
    status: 'in_transit',
    title: 'Departed Primary Air Logistics Hub',
    description: 'Consignment loaded and airborne on Flight FW-402 en route to Frankfurt.',
    location: 'London Heathrow Air Cargo Terminal',
    timestamp: '2026-09-14T11:30:00.000Z',
    createdBy: user.uid,
    serverTimestamp: serverTimestamp(),
  });

  console.log('✓ 2 milestone tracking events written to shipments/{id}/trackingEvents');

  // 5. Test Public Tracking Query
  console.log('\n5. Testing Public Tracking Lookup Query (by trackingNumber)...');
  const q = query(
    collection(db, 'shipments'),
    where('trackingNumber', '==', trackingNumber),
    limit(1)
  );
  const searchSnap = await getDocs(q);
  if (searchSnap.empty) {
    throw new Error(`Tracking lookup failed: No shipment found with tracking number ${trackingNumber}`);
  }
  const foundShipment = searchSnap.docs[0].data();
  console.log('✓ Public Tracking Lookup SUCCESS:');
  console.log(`  - Document ID: ${searchSnap.docs[0].id}`);
  console.log(`  - Tracking: ${foundShipment.trackingNumber}`);
  console.log(`  - Origin: ${foundShipment.originHub} -> Destination: ${foundShipment.destinationHub}`);
  console.log(`  - Status: ${foundShipment.status}`);
  console.log(`  - Description: ${foundShipment.packageDetails.description}`);

  // Query events
  const foundEventsSnap = await getDocs(query(eventsCollection, orderBy('timestamp', 'asc')));
  console.log(`✓ Fetched ${foundEventsSnap.size} milestone event(s) for tracking timeline:`);
  foundEventsSnap.forEach(d => {
    const e = d.data();
    console.log(`    [${e.timestamp}] (${e.status}) ${e.title} @ ${e.location}`);
  });

  // 6. Test Customer Booking Intake (bookingRequests)
  console.log('\n6. Testing Customer Booking Intake Submission (bookingRequests)...');
  const bookingRef = doc(collection(db, 'bookingRequests'));
  const bookingData = {
    referenceCode: 'BK-710492',
    status: 'pending_review',
    serviceType: 'express-parcel',
    sender: {
      name: 'Sarah Jenkins',
      phone: '+1 415 555 0192',
      email: 'sjenkins@innovatepac.com',
      address: {
        street: '550 Mission St',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
      },
    },
    receiver: {
      name: 'Klaus Schmidt',
      phone: '+49 30 2095 8311',
      email: 'kschmidt@berlincode.de',
      address: {
        street: 'Friedrichstraße 140',
        city: 'Berlin',
        state: 'Berlin',
        country: 'Germany',
      },
    },
    packageDetails: {
      description: 'Prototype Optical Hardware',
      category: 'electronics',
      weightKg: 3.2,
      quantity: 1,
    },
    notes: 'Fragile optics, handle with care.',
    createdAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
  };

  await setDoc(bookingRef, bookingData);
  console.log(`✓ Booking inquiry submitted with ID: ${bookingRef.id} and Reference: ${bookingData.referenceCode}`);

  // 7. Verify Admin Intake Queue Listing
  console.log('\n7. Verifying Admin Booking Queue Query...');
  const intakeSnap = await getDocs(query(collection(db, 'bookingRequests'), limit(5)));
  console.log(`✓ Retrieved ${intakeSnap.size} booking request(s) from intake queue:`);
  intakeSnap.forEach(d => {
    const req = d.data();
    console.log(`    - ID: ${d.id} | Ref: ${req.referenceCode} | From: ${req.sender?.name} | To: ${req.receiver?.name} | Status: ${req.status}`);
  });

  console.log('\n=== ALL PHASE 3 BACKEND INTEGRATION TESTS PASSED PERFECTLY ===');
}

runVerification().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
