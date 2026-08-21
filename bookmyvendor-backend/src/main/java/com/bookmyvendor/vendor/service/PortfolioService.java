package com.bookmyvendor.vendor.service;

import com.bookmyvendor.auth.entity.VendorProfile;
import com.bookmyvendor.auth.repository.VendorProfileRepository;
import com.bookmyvendor.vendor.dto.PortfolioImageDto;
import com.bookmyvendor.vendor.entity.VendorPortfolioImage;
import com.bookmyvendor.vendor.repository.VendorPortfolioImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final VendorPortfolioImageRepository portfolioImageRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final CloudinaryService cloudinaryService;

    // ── Get all images for a vendor ──────────────────────────────────
    public List<PortfolioImageDto> getVendorPortfolio(UUID vendorId) {
        // Here vendorId can be the actual VendorProfile UUID. But let's assume we pass VendorProfile UUID.
        return portfolioImageRepository.findByVendorProfileIdOrderByDisplayOrderAsc(vendorId)
                .stream()
                .map(PortfolioImageDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Get all images for current logged-in vendor (by User UUID) ───
    public List<PortfolioImageDto> getMyPortfolio(UUID userId) {
        VendorProfile profile = vendorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));
        return getVendorPortfolio(profile.getId());
    }

    // ── Upload a new image ──────────────────────────────────────────
    @Transactional
    public PortfolioImageDto uploadImage(UUID userId, MultipartFile file) throws IOException {
        VendorProfile profile = vendorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));

        // Upload to Cloudinary under folder "bookmyvendor/portfolio"
        Map<String, Object> uploadResult = cloudinaryService.uploadImage(file, "bookmyvendor/portfolio");
        String imageUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        // Determine current max display order
        List<VendorPortfolioImage> existing = portfolioImageRepository.findByVendorProfileIdOrderByDisplayOrderAsc(profile.getId());
        int nextOrder = existing.isEmpty() ? 0 : existing.get(existing.size() - 1).getDisplayOrder() + 1;

        VendorPortfolioImage newImage = VendorPortfolioImage.builder()
                .vendorProfile(profile)
                .imageUrl(imageUrl)
                .publicId(publicId)
                .displayOrder(nextOrder)
                .build();

        VendorPortfolioImage saved = portfolioImageRepository.save(newImage);
        return PortfolioImageDto.fromEntity(saved);
    }

    // ── Delete an image ─────────────────────────────────────────────
    @Transactional
    public void deleteImage(UUID userId, UUID imageId) {
        VendorProfile profile = vendorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));

        VendorPortfolioImage image = portfolioImageRepository.findByIdAndVendorProfileId(imageId, profile.getId())
                .orElseThrow(() -> new IllegalArgumentException("Image not found or doesn't belong to you"));

        // Remove from Cloudinary
        cloudinaryService.deleteImage(image.getPublicId());

        // Remove from DB
        portfolioImageRepository.delete(image);
    }
}
