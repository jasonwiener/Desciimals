# Encoded Elevations Algorithm Format

EncodedElevations is a lossy compression algorithm that allows you to store a series of  elevations as a single string. Point elevations are encoded using signed values. 

The encoding process converts a binary value into a series of character codes for ASCII characters using the familiar base64 encoding scheme. The algorithm expects a list/array of values, in meters. To ensure the proper encoding and decoding of data, the algorithm uses a 2-pass process.  In the first pass, the algorithm maps each point to a precision of 1 decimal place. This provides accuracy to 0.1 meters (~4 inches).

Additionally, to conserve space, points only include the offset from the previous point (except of course for the first point). All points are encoded in Base64 as signed integers, as latitudes and longitudes are signed values. 

## NEED to expand -- notes
* encode point 1
* calculate deltas
* determine biggest single step deltas
* find best fit resolution
* determine biggest negative delta
* create pad to scale/re-zero data + abs value of biggest negative delta
* encode delta point scaled/re-zerod using the min value (dead sea elevation)
* encode the deltas
* assemble the encoded string and return
  * first point - 3 chars
  * delta point - 3 chars
  * resolution - 1 char ("1" | "2" | "3" ...)
  * deltas - variable char length (defined in resolution)




