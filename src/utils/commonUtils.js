/* eslint-disable camelcase */
import jsPDF from 'jspdf';

const MAX_SIZE = 26214400;

export const mapImageToState = (imageArray, baseUrl) =>
  imageArray.map(item => ({
    preview: baseUrl + item,
  }));

export function mediaLengthValidator(file) {
  if (file.size > MAX_SIZE) {
    const mediaType = file.type.split('/')[0];
    return {
      code: 'size-too-large',
      message: `${mediaType} is too large.Please upload less then 25 Mb`,
    };
  }

  return null;
}

const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

export const imageDimensionsOnA4 = dimensions => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

export const generatePdfFromImages = async (image, type) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();
  doc.deletePage(1);

  const imageDimensions = imageDimensionsOnA4({
    width: 90,
    height: 90,
  });

  doc.addPage();
  doc.addImage(
    image,
    type.split('/')[1],
    (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
    (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
    imageDimensions.width,
    imageDimensions.height
  );

  const pdfBlob = doc.output('blob');
  pdfBlob.name = 'POLICEREPORT.pdf';

  return pdfBlob;
};

export const removeGteFromUrl = router => {
  const urlWithOutGte = `${window.location.origin}${router.asPath}`;
  window.history.replaceState(
    { ...window.history.state, as: urlWithOutGte, url: urlWithOutGte },
    null,
    urlWithOutGte
  );
};

export const checkAdsQueryParams = query => {
  if (
    query &&
    (Object.prototype.hasOwnProperty.call(query, 'motopia_campaign') ||
      Object.prototype.hasOwnProperty.call(query, 'motopia_medium') ||
      Object.prototype.hasOwnProperty.call(query, 'motopia_source'))
  ) {
    return true;
  } else {
    return false;
  }
};

export const getAdsQueryParams = queryParam => {
  const {
    motopia_campaign = null,
    motopia_source = null,
    motopia_medium = null,
  } = queryParam;
  return {
    motopia_campaign,
    motopia_source,
    motopia_medium,
  };
};

export const getCreditIdQueryParams = queryParam => {
  const { creditId = null, res = null } = queryParam;
  return {
    creditId,
    res,
  };
};

export const getNewPriceList = (array, searchedState) =>
  (array?.rsdVariesprice || []).filter(
    el => el.state === searchedState.toUpperCase()
  );

export const applyAdsQuery = query =>
  checkAdsQueryParams(query) ? getAdsQueryParams(query) : {};

export const getGteUrl = (query, queryParam) => {
  const gteUrl = checkAdsQueryParams(query)
    ? `&gte=${queryParam}`
    : `?gte=${queryParam}`;
  return gteUrl;
};
export const appendQueryParams = (baseUrl, adsQuery) => {
  if (Object.keys(adsQuery).length === 0) {
    return baseUrl;
  }
  const adsQueryParams = new URLSearchParams(adsQuery);
  const adsQueryString = adsQueryParams.toString();

  // Check if the baseUrl already contains a question mark
  const separator = baseUrl.includes('?') ? '&' : '?';

  return `${baseUrl}${separator}${adsQueryString}`;
};
export const rejectMessage = `Regrettably, we are UNABLE to approve you for a rideshare 
use vehicle at this time. Feel free to reach our sales department for additional information`;

export const tierMessage = tierName => {
  let message;

  if (tierName) {
    if (tierName.includes('Tier 1') || tierName.includes('Tier 2')) {
      message = `Congrats! Based on the banking information provided, you are APPROVED as a ${tierName} period.
      You can proceed to choose a vehicle with YOUR approved down payment 
      and YOUR approved weekly payment, and arrange a pickup at a location near you.`;
    }
  }

  return message;
};
