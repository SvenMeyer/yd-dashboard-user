import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type DiamondProperties = {
  microCarat?: string;
  colorGrade?: string;
  clarityGrade?: string;
  cutGrade?: string;
  fluorescence?: string;
  polishGrade?: string;
  symmetryGrade?: string;
  // ... (keep other existing properties)
}

type NFTProperties = {
  id: string
  creationDateTime: string
  blockchain: string
  mintTransactionId: string
}

const defaultProperties: DiamondProperties = {
  // ... (keep existing default properties)
}

const defaultNFTProperties: NFTProperties = {
  // ... (keep existing default NFT properties)
}

const defaultImageLink = "https://4cs.gia.edu/wp-content/uploads/2024/07/02_Cut-GradingScale_960x800.jpg"

export default function DiamondPropertiesComponent({ 
  properties = {}, 
  nftProperties = defaultNFTProperties 
}: { 
  properties?: DiamondProperties,
  nftProperties?: NFTProperties
}) {
  const mergedProperties = { ...defaultProperties, ...properties }

  const renderPropertyRow = (key: string, value: any) => (
    <TableRow key={key}>
      <TableCell className="font-light py-1">
        {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
      </TableCell>
      <TableCell className="py-1">
        {key === 'measurements' && Array.isArray(value)
          ? value.join(' x ') + ' mm'
          : typeof value === 'number'
          ? value.toFixed(2)
          : value}
      </TableCell>
    </TableRow>
  )

  return (
    <div className="flex flex-col md:flex-row bg-white text-gray-800 font-['Poppins',_sans-serif] gap-4">
      <div className="w-full md:w-1/2 flex flex-col gap-4 order-1 md:order-1">
        <div className="w-full">
          <Image
            src={defaultImageLink}
            alt="Diamond"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </div>
        <div className="border border-gray-300 p-4 order-3 md:order-2">
          <h2 className="text-2xl font-light mb-4 text-gray-700 pl-2">DDC NFT Properties</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2 text-left font-bold text-gray-600 py-1">Property</TableHead>
                <TableHead className="w-1/2 text-left font-bold text-gray-600 py-1">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-light py-1">ID</TableCell>
                <TableCell className="py-1">{nftProperties.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-light py-1">Creation date / time</TableCell>
                <TableCell className="py-1">{nftProperties.creationDateTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-light py-1">Blockchain</TableCell>
                <TableCell className="py-1">{nftProperties.blockchain}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-light py-1">Mint transaction id</TableCell>
                <TableCell className="break-all py-1">{nftProperties.mintTransactionId}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="w-full md:w-1/2 order-2 md:order-2">
        <div className="border border-gray-300 p-4">
          <h2 className="text-2xl font-light mb-4 text-gray-700 pl-2">Diamond Grading Report Data</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2 text-left font-bold text-gray-600 py-1">Property</TableHead>
                <TableHead className="w-1/2 text-left font-bold text-gray-600 py-1">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderPropertyRow('microCarat', mergedProperties.microCarat)}
              {renderPropertyRow('colorGrade', mergedProperties.colorGrade)}
              {renderPropertyRow('clarityGrade', mergedProperties.clarityGrade)}
              {renderPropertyRow('cutGrade', mergedProperties.cutGrade)}
              {renderPropertyRow('fluorescence', mergedProperties.fluorescence)}
              {renderPropertyRow('polishGrade', mergedProperties.polishGrade)}
              {renderPropertyRow('symmetryGrade', mergedProperties.symmetryGrade)}
              <TableRow>
                <TableCell colSpan={2} className="font-bold pt-3 pb-1">Grading Results</TableCell>
              </TableRow>
              {renderPropertyRow('caratWeight', mergedProperties.caratWeight)}
              {renderPropertyRow('colorGrade', mergedProperties.colorGrade)}
              {renderPropertyRow('clarityGrade', mergedProperties.clarityGrade)}
              {renderPropertyRow('cutGrade', mergedProperties.cutGrade)}
              <TableRow>
                <TableCell colSpan={2} className="font-bold pt-3 pb-1">Additional Grading Information</TableCell>
              </TableRow>
              {renderPropertyRow('polish', mergedProperties.polish)}
              {renderPropertyRow('symmetry', mergedProperties.symmetry)}
              {renderPropertyRow('fluorescence', mergedProperties.fluorescence)}
              {renderPropertyRow('inscriptions', mergedProperties.inscriptions)}
              {renderPropertyRow('comments', mergedProperties.comments)}
              <TableRow>
                <TableCell colSpan={2} className="font-bold pt-3 pb-1">Additional Properties</TableCell>
              </TableRow>
              {Object.entries(mergedProperties)
                .filter(([key]) => !['reportDate', 'reportNumber', 'shape', 'measurements', 'caratWeight', 'colorGrade', 'clarityGrade', 'cutGrade', 'polish', 'symmetry', 'fluorescence', 'inscriptions', 'comments'].includes(key))
                .map(([key, value]) => renderPropertyRow(key, value))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}