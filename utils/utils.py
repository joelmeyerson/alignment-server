import warnings
from Bio.Seq import Seq
from Bio import SeqIO
warnings.filterwarnings("error")


def align(input):
    """
    Takes DNA sequence as input, translates the input to a
    peptide, and searches target genomes for a protein which
    contains the peptide.
    """

    genomes = [
        "NC_000852.gb",
        "NC_007346.gb",
        "NC_008724.gb",
        "NC_009899.gb",
        "NC_014637.gb",
        "NC_020104.gb",
        "NC_023423.gb",
        "NC_016072.gb",  # replaces NC_023640
        "NC_023719.gb",
        "NC_027867.gb"
    ]

    # create Seq object from DNA input, translate to amino acid sequence
    dna = Seq(input)

    try:
        peptide = dna.translate()
        peptide = str(peptide)
    except:
        return ("could not translate", "no match found", "", "", -1)

    # iterate through genomes
    for g in genomes:

        # get record from each genome (assumes each genome only has one record)
        # updated for PythonAnywhere server                                                                       
        gb_record = SeqIO.read(open(f"/home/joelmeyerson/alignment-server/utils/genomes/{g}", "r"), "gb")


        # iterate through all entries in the record (either "gene" or "CDS")
        for entry in gb_record.features:

            # CDS contains protein sequence
            if entry.type == "CDS":

                # get protein sequence
                protein = entry.qualifiers["translation"]
                protein = str(protein)

                # search for query sequence in protein
                position = protein.find(peptide)

                # substring search returns -1 if not match found
                if position == -1:
                    pass

                else:
                    product = entry.qualifiers["product"]
                    protein_id = entry.qualifiers["protein_id"]

                    return (peptide, protein, product, protein_id, position)

    # no match found in genome
    return (peptide, "no match found", "", "", -1)
