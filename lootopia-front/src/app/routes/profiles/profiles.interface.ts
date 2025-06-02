export interface ProfilesInterface {
  compte: 'particulier' | 'partenaire';
  nickname: string;
  email: string;
  telephone: string;
  bio: string;
  photo: string;
  acceptMFA: boolean;
  compteOff: boolean;
}
