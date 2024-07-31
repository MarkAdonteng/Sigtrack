import {Timestamp, CollectionReference } from 'firebase/firestore';


export interface Team {
    id: string;
    name: string;
    date_established: Timestamp;
    color?: string;
    status: 'active' | 'suspended';
    description: string;
    members: CollectionReference[];
    timestamp: number; // Add timestamp for caching
    organization?: string;
  }

  export interface MemberData {
    dateAdded: Timestamp;
    userId: string;
    callSign: string;
    status: string;
  
  }
  export interface MemberFeatures {
    name:string;
    dateAdded: Timestamp;
    userId: string;
    callSign: string;
    status: string;
  
  }

  export interface DroppedMarker {
    id: string;
    position: { lat: number; lng: number };
    markerUrl: string;
    name?: string;
    description?: string;
  }
  export interface CustomMarkerModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { title: string; latitude: string; longitude: string; desc: string }) => void;
    title: string;
    formData: {
      title: string;
      latitude: string;
      longitude: string;
      desc: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
      title: string;
      latitude: string;
      longitude: string;
      desc: string;
    }>>;
  }

  export interface AddTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
      newTeamName: string;
      userEnteredStatus: string;
      userEnteredColor: string;
      userEnteredDescription: string;
    }) => void;
  }

  export interface Member {
    userId: string;
    callSign: string;
    name: string;
    dateAdded: Timestamp; // Change this to Firestore Timestamp
    status: string;
    organization?: string;
    teamId: string;
  }

  export interface AddMembersProps {
    onAddMembers: () => Promise<void>;
    teamId: string;
    teamDataArray: { teamId: string, teamName: string, members: MemberData[], teamColor: string }[];
    setTeamDataArray: React.Dispatch<React.SetStateAction<{ teamId: string, teamName: string, members: MemberData[], teamColor: string }[]>>;
  }

  export interface Users{
    callSign: string,
        dateCreated: Timestamp,
        lat: number,
        lon: number,
        name: string,
        organization: string,
        password: string, // Consider security implications of storing and fetching passwords
        status: string,
        teamId: string,
        userId:string,
        userType: string,
  }
