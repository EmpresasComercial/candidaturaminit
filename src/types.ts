export interface Agendamento {
  id: string;
  nomeCompleto: string;
  nomeCompletoPai: string;
  nomeCompletoMae: string;
  dataNascimento: string;
  dataEmissaoBilhete: string;
  dataExpiracaoBilhete: string;
  email?: string;
  provinciaNaturalidade: string;
  orgao: string;
  genero: string;
  modalidadePagamento: 'multicaixa';
  comentario?: string;
  valor: number;
  dataCriacao: string;
  referenciaMulticaixa: string;
  entidadeMulticaixa: string;
  pago: boolean;
  numeroOrdem: number;
  numeroFatura?: string;
}


export const PROVINCIAS_ANGOLA = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando',
  'Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Icolo e Bengo',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Moxico Leste',
  'Namibe',
  'Uíge',
  'Zaire'
];

export const MUNICIPIOS_POPULARES: Record<string, string[]> = {
  'Luanda': ['Luanda', 'Belas', 'Cacuaco', 'Cazenga', 'Icolo e Bengo', 'Quiçama', 'Kilamba Kiaxi', 'Talatona', 'Viana'],
  'Benguela': ['Benguela', 'Baía Farta', 'Catumbela', 'Lobito', 'Balombo', 'Bocoio', 'Caimbambo', 'Chongoroi', 'Ganda', 'Cubal'],
  'Huambo': ['Huambo', 'Caála', 'Eculica', 'Londuimbali', 'Longonjo', 'Mungo', 'Chicala-Choloanga', 'Chinjenje', 'Ucuma', 'Bailundo'],
  'Huila': ['Lubango', 'Caconda', 'Caluquembe', 'Chibia', 'Chicomba', 'Chipindo', 'Cuvango', 'Humpata', 'Jamba', 'Matala', 'Quilengues', 'Quipungo'],
  'Cabinda': ['Cabinda', 'Cacongo', 'Buco-Zau', 'Belize'],
  'Malanje': ['Malanje', 'Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Kunda-dia-Baze', 'Luquembo', 'Mucari', 'Quela'],
  'Uige': ['Uíge', 'Negage', 'Sanza Pombo', 'Maquela do Zombo', 'Damba', 'Bembe', 'Mucaba', 'Songo'],
};
