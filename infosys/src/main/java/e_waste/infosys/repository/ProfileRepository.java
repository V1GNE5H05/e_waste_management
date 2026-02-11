package e_waste.infosys.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import e_waste.infosys.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUserEmail(String email);
}
