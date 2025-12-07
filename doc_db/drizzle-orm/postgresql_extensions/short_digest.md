## pg_vector

Vector similarity search with column type `vector({ dimensions: 3 })`, HNSW indexes with distance operators (vector_l2_ops, vector_ip_ops, vector_cosine_ops, vector_l1_ops, bit_hamming_ops, bit_jaccard_ops), and helper functions: `l2Distance()`, `l1Distance()`, `innerProduct()`, `cosineDistance()`, `hammingDistance()`, `jaccardDistance()`. Custom distance functions follow the pattern of wrapping operators in SQL templates.

## PostGIS

Geospatial data support with `geometry()` column type accepting `type` (e.g., 'point') and `mode` ('tuple' for [x,y] or 'xy' for {x,y}), optional `srid` parameter, and GIST indexes.