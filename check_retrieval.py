from models.legal_retriever import LegalRetriever

r = LegalRetriever()

x = r.retrieve_with_scores(
    "theft punishment Section 379 Pakistan Penal Code",
    10
)

for d, s in x:
    print("=" * 80)
    print("SCORE:", s)
    print("TITLE:", d.metadata.get("title"))
    print("SECTION:", d.metadata.get("section"))
    print("TEXT:")
    print(d.page_content[:1200])
